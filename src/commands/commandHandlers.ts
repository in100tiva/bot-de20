import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { postarDesafio } from '../utils/scheduler.js';
import { dailyChallenges } from '../utils/challenges.js';
import { prisma, userService, goDevsActivityService, badgeService } from '../lib/prisma.js';
import { fetchGoDevsActivities, checkDiscordIdInGoDevs } from '../lib/supabase.js';
import { announceMultipleAchievements } from '../utils/announcements.js';

export const handleSlashCommands = async (interaction: ChatInputCommandInteraction, client: Client) => {
    const { commandName } = interaction;

    try {
        if (commandName === 'desafio') {
            const id = interaction.options.get('id')?.value as number | undefined;
            
            await interaction.deferReply({ ephemeral: true });
            await postarDesafio(client, id || null);
            
            await interaction.editReply({
                content: id 
                    ? `✅ Desafio #${id} enviado com sucesso!`
                    : '✅ Desafio aleatório enviado com sucesso!'
            });
        }

        else if (commandName === 'status') {
            // 🔥 AGORA USA O BANCO DE DADOS PRISMA
            const postedChallenges = await prisma.dailyPost.findMany({
                select: { challengeId: true },
                distinct: ['challengeId'],
                orderBy: { challengeId: 'asc' }
            });
            
            const usados = postedChallenges.map(p => p.challengeId);
            const total = dailyChallenges.length;
            const restantes = total - usados.length;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('📊 Status dos Desafios')
                .setDescription(`Sistema de desafios automáticos do GoDevs`)
                .addFields(
                    { name: '📝 Total de Desafios', value: `\`${total}\``, inline: true },
                    { name: '✅ Já Enviados', value: `\`${usados.length}\``, inline: true },
                    { name: '⏳ Restantes', value: `\`${restantes}\``, inline: true }
                )
                .addFields({
                    name: '🔢 IDs Enviados:',
                    value: usados.length > 0 
                        ? usados.sort((a: number, b: number) => a - b).map((id: number) => `\`${id}\``).join(', ')
                        : '_Nenhum desafio enviado ainda_'
                })
                .setFooter({ text: 'Use /desafio para enviar manualmente • Dados do banco Prisma' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        else if (commandName === 'adicionar') {
            const id = interaction.options.get('id')?.value as number;
            
            if (!dailyChallenges.find(c => c.id === id)) {
                await interaction.reply({
                    content: `❌ Desafio com ID \`${id}\` não existe! IDs válidos: 1 a ${dailyChallenges.length}`,
                    ephemeral: true
                });
                return;
            }

            // 🔥 VERIFICA NO BANCO DE DADOS
            const alreadyPosted = await prisma.dailyPost.findFirst({
                where: { challengeId: id }
            });

            if (alreadyPosted) {
                await interaction.reply({
                    content: `⚠️ O desafio #${id} já foi postado em ${new Date(alreadyPosted.postedAt).toLocaleDateString()}!`,
                    ephemeral: true
                });
                return;
            }

            // 🔥 REGISTRA NO BANCO (simulando postagem manual)
            await prisma.dailyPost.create({
                data: {
                    challengeId: id,
                    channelId: 'manual',
                    messageId: 'manual',
                    postedAt: new Date()
                }
            });

            await interaction.reply({
                content: `✅ Desafio #${id} marcado como enviado no banco de dados!`,
                ephemeral: true
            });
        }

        else if (commandName === 'limpar') {
            // 🔥 LIMPA O BANCO DE DADOS
            const deleted = await prisma.dailyPost.deleteMany({});
            
            await interaction.reply({
                content: `✅ Histórico de desafios limpo! ${deleted.count} registros removidos do banco de dados. Todos os desafios estão disponíveis novamente.`,
                ephemeral: true
            });
        }

        else if (commandName === 'agenda') {
            const nextRun = getNextCronTime();
            
            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('⏰ Agendamento Automático')
                .setDescription('Informações sobre o sistema de postagens automáticas')
                .addFields(
                    { name: '🕐 Horário', value: '`02:40` (Horário de Brasília)', inline: true },
                    { name: '🌍 Timezone', value: '`America/Sao_Paulo`', inline: true },
                    { name: '📅 Frequência', value: '`Todos os dias`', inline: true }
                )
                .addFields({
                    name: '⏳ Próxima Execução',
                    value: nextRun
                })
                .addFields({
                    name: 'ℹ️ Como funciona',
                    value: 'O bot seleciona automaticamente um desafio que ainda não foi enviado (consultando o banco de dados Prisma) e posta no canal #desafio'
                })
                .setFooter({ text: 'Use /desafio para postar manualmente a qualquer momento' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // === COMANDOS DE GAMIFICAÇÃO ===

        else if (commandName === 'ranking') {
            await interaction.deferReply({ ephemeral: false }); // Ranking é público

            const ranking = await userService.getFullRanking(10);

            if (ranking.length === 0) {
                await interaction.editReply({
                    content: '📊 **Nenhum usuário no ranking ainda!**\n\nEntregue atividades no [Portal GoDevs](https://godevs.in100tiva.com) e use `/atualizar` para sincronizar!'
                });
                return;
            }

            const medals = ['🥇', '🥈', '🥉'];
            const rankingList = ranking.map((user, index) => {
                const medal = medals[index] || `**${index + 1}.**`;
                const totalActivities = user.goDevsActivitiesCount || 0;
                return `${medal} **${user.username}** — 🔥 ${user.streak} dias | 📊 ${totalActivities} atividades`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('🏆 Ranking GoDevs')
                .setDescription(rankingList)
                .addFields({
                    name: '📈 Como subir no ranking?',
                    value: '• Entregue atividades no [Portal GoDevs](https://godevs.in100tiva.com)\n• Vincule seu Discord ID no perfil do GoDevs\n• Use `/atualizar` para sincronizar suas atividades'
                })
                .setFooter({ text: `Top ${ranking.length} usuários • Atualizado agora` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        else if (commandName === 'perfil') {
            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            const isOwnProfile = targetUser.id === interaction.user.id;
            
            await interaction.deferReply({ ephemeral: true });

            // Verifica se o Discord ID está cadastrado no GoDevs
            const { exists: discordIdInGoDevs, error: checkError } = await checkDiscordIdInGoDevs(targetUser.id);

            // Busca ou cria o perfil local
            let profile = await userService.getFullProfile(targetUser.id);
            
            // Se não existe perfil local, cria um básico para o usuário
            if (!profile && isOwnProfile) {
                await userService.findOrCreate(targetUser.id, targetUser.username);
                profile = await userService.getFullProfile(targetUser.id);
            }

            if (!profile) {
                await interaction.editReply({
                    content: `❌ **${targetUser.username}** ainda não tem um perfil no bot.\n\nEle precisa usar \`/perfil\` ou \`/atualizar\` para criar o perfil.`
                });
                return;
            }

            const { stats } = profile;
            
            // Monta aviso se Discord ID não está no GoDevs
            let warningMessage = '';
            if (!discordIdInGoDevs && !checkError) {
                warningMessage = '\n\n⚠️ **Discord ID não vinculado ao GoDevs!**\nAcesse [godevs.in100tiva.com](https://godevs.in100tiva.com) → Perfil → Configure seu Discord ID para sincronizar suas atividades.';
            }

            const badgesList = stats.badges.length > 0 
                ? stats.badges.map(ub => `${ub.badge.icon} ${ub.badge.name}`).join('\n')
                : '_Nenhuma badge conquistada_';

            const embed = new EmbedBuilder()
                .setColor(discordIdInGoDevs ? 0x5865F2 : 0xFFA500) // Laranja se não vinculado
                .setTitle(`📊 Perfil de ${profile.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
                .addFields(
                    { name: '🔥 Streak', value: `\`${stats.streak} dias\``, inline: true },
                    { name: '💻 Atividades GoDevs', value: `\`${stats.goDevsActivities}\``, inline: true },
                    { name: '🔗 Vinculado ao GoDevs', value: discordIdInGoDevs ? '`✅ Sim`' : '`❌ Não`', inline: true }
                )
                .addFields({
                    name: '🏆 Badges',
                    value: badgesList
                });

            // Adiciona aviso se não vinculado
            if (!discordIdInGoDevs && !checkError) {
                embed.addFields({
                    name: '⚠️ Ação Necessária',
                    value: 'Vincule seu Discord ID no [Portal GoDevs](https://godevs.in100tiva.com) para sincronizar suas atividades!\n\n**Como fazer:**\n1. Acesse godevs.in100tiva.com\n2. Vá em Configurações do Perfil\n3. Cole seu Discord ID: `' + targetUser.id + '`'
                });
            }
            
            embed.setFooter({ 
                text: stats.lastSynced 
                    ? `Última sincronização: ${new Date(stats.lastSynced).toLocaleDateString('pt-BR')} • Use /atualizar`
                    : 'Nunca sincronizado — use /atualizar'
            })
            .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        else if (commandName === 'atualizar') {
            await interaction.deferReply({ ephemeral: true });

            const discordId = interaction.user.id;
            const username = interaction.user.username;

            // Busca ou cria o usuário
            const user = await userService.findOrCreate(discordId, username);

            // Busca atividades do Supabase GoDevs
            const { activities, count, error } = await fetchGoDevsActivities(discordId);

            if (error) {
                await interaction.editReply({
                    content: `⚠️ **Erro ao sincronizar:**\n\n${error}\n\n**Possíveis soluções:**\n• Verifique se seu Discord ID está cadastrado no GoDevs\n• Tente novamente em alguns segundos`
                });
                return;
            }

            if (count === 0) {
                await userService.updateGoDevsCount(discordId, 0);
                await interaction.editReply({
                    content: '📭 **Nenhuma atividade encontrada no GoDevs.**\n\n**Dicas:**\n• Seu Discord ID pode não estar vinculado ao seu perfil no GoDevs\n• Acesse [godevs.in100tiva.com](https://godevs.in100tiva.com) e vincule seu Discord nas configurações do perfil'
                });
                return;
            }

            // Sincroniza atividades para o cache local
            await goDevsActivityService.syncActivities(user.id, activities);
            await userService.updateGoDevsCount(discordId, count);

            // 🏆 Garante que badges existem e verifica conquistas
            await badgeService.ensureBadgesExist();
            const newBadges = await badgeService.checkAndAward(user.id, count);
            
            // Se conquistou novas badges, anuncia no canal #conquistas
            if (newBadges.length > 0) {
                await announceMultipleAchievements(client, interaction.user, newBadges);
            }

            // Lista as 5 atividades mais recentes
            const recentActivities = activities.slice(0, 5).map((a, i) => 
                `${i + 1}. **${a.lesson_name || 'Sem nome'}** (${a.tipo_atividade})`
            ).join('\n');

            // Monta mensagem de badges conquistadas (se houver)
            const badgesMessage = newBadges.length > 0 
                ? `\n\n🏆 **Novas badges conquistadas:** ${newBadges.map(b => `${b.icon} ${b.name}`).join(', ')}`
                : '';

            const embed = new EmbedBuilder()
                .setColor(newBadges.length > 0 ? 0xFFD700 : 0x00FF00) // Dourado se ganhou badges
                .setTitle(newBadges.length > 0 ? '✅ Sincronização + Novas Conquistas!' : '✅ Sincronização Concluída!')
                .setDescription(`**${count}** atividades do GoDevs foram sincronizadas com sucesso!${badgesMessage}`)
                .addFields({
                    name: '📋 Atividades Recentes',
                    value: recentActivities || '_Nenhuma_'
                })
                .addFields({
                    name: '💡 Dica',
                    value: 'Use `/perfil` para ver suas estatísticas completas!'
                })
                .setFooter({ text: `Discord ID: ${discordId}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

    } catch (error: any) {
        console.error('Erro ao executar comando:', error);
        
        const errorMessage = {
            content: `❌ Erro ao executar o comando: ${error.message}`,
            ephemeral: true
        };

        if (interaction.deferred) {
            await interaction.editReply(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
};

function getNextCronTime(): string {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Define para 02:40 de hoje
    nextRun.setHours(2, 40, 0, 0);
    
    // Se já passou das 02:40, agenda para amanhã
    if (now.getHours() > 2 || (now.getHours() === 2 && now.getMinutes() >= 40)) {
        nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const diff = nextRun.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `<t:${Math.floor(nextRun.getTime() / 1000)}:R> (em ~${hours}h ${minutes}m)`;
}
