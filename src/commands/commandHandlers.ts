import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { postarDesafio } from '../utils/scheduler.js';
import { dailyChallenges } from '../utils/challenges.js';
import { challengeService, prisma, userService, submissionService, goDevsActivityService } from '../lib/prisma.js';
import { fetchGoDevsActivities } from '../lib/supabase.js';

// Regex para validar URLs do GitHub
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?.*$/i;

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

        else if (commandName === 'entregar') {
            const desafioId = interaction.options.get('desafio_id')?.value as number;
            const url = interaction.options.get('url')?.value as string;
            
            // Valida URL do GitHub
            if (!GITHUB_URL_REGEX.test(url)) {
                await interaction.reply({
                    content: '❌ **URL inválida!**\n\nUse um link do GitHub válido, por exemplo:\n`https://github.com/seu-usuario/seu-repositorio`',
                    ephemeral: true
                });
                return;
            }

            // Verifica se o desafio existe
            const desafioExiste = dailyChallenges.find(c => c.id === desafioId);
            if (!desafioExiste) {
                await interaction.reply({
                    content: `❌ **Desafio #${desafioId} não encontrado!**\n\nIDs válidos: 1 a ${dailyChallenges.length}\n\nUse \`/status\` para ver os desafios disponíveis.`,
                    ephemeral: true
                });
                return;
            }

            await interaction.deferReply({ ephemeral: true });

            // Busca ou cria o usuário
            const discordUser = interaction.user;
            const user = await userService.findOrCreate(discordUser.id, discordUser.username);

            // Cria a submissão
            const submission = await submissionService.create(user.id, desafioId, url);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Entrega Registrada!')
                .setDescription(`Sua solução do desafio **${desafioExiste.title}** foi recebida com sucesso!`)
                .addFields(
                    { name: '🔢 ID da Entrega', value: `\`${submission.id.slice(0, 8)}\``, inline: true },
                    { name: '🎯 Desafio', value: `#${desafioId}`, inline: true },
                    { name: '📊 Status', value: '`Pendente`', inline: true }
                )
                .addFields({
                    name: '🔗 Repositório',
                    value: `[Clique aqui](${url})`
                })
                .setFooter({ text: 'Sua entrega será avaliada em breve!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        else if (commandName === 'ranking') {
            await interaction.deferReply({ ephemeral: false }); // Ranking é público

            const ranking = await userService.getFullRanking(10);

            if (ranking.length === 0) {
                await interaction.editReply({
                    content: '📊 **Nenhum usuário no ranking ainda!**\n\nSeja o primeiro a entregar um desafio com `/entregar`!'
                });
                return;
            }

            const medals = ['🥇', '🥈', '🥉'];
            const rankingList = ranking.map((user, index) => {
                const medal = medals[index] || `**${index + 1}.**`;
                const totalActivities = (user._count?.submissions || 0) + (user.goDevsActivitiesCount || 0);
                return `${medal} **${user.username}** — ${user.points} pts | 🔥 ${user.streak} dias | 📊 ${totalActivities} atividades`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('🏆 Ranking GoDevs')
                .setDescription(rankingList)
                .addFields({
                    name: '📈 Como subir no ranking?',
                    value: '• Entregue desafios com `/entregar`\n• Mantenha sua streak ativa\n• Sincronize atividades do GoDevs com `/atualizar`'
                })
                .setFooter({ text: `Top ${ranking.length} usuários • Atualizado agora` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        else if (commandName === 'perfil') {
            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            
            await interaction.deferReply({ ephemeral: true });

            const profile = await userService.getFullProfile(targetUser.id);

            if (!profile) {
                await interaction.editReply({
                    content: targetUser.id === interaction.user.id
                        ? '❌ **Você ainda não tem um perfil!**\n\nEntregue seu primeiro desafio com `/entregar` para criar seu perfil.'
                        : `❌ **${targetUser.username}** ainda não tem um perfil no bot.`
                });
                return;
            }

            const { stats } = profile;
            const badgesList = stats.badges.length > 0 
                ? stats.badges.map(ub => `${ub.badge.icon} ${ub.badge.name}`).join('\n')
                : '_Nenhuma badge conquistada_';

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`📊 Perfil de ${profile.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
                .addFields(
                    { name: '⭐ Pontos', value: `\`${stats.totalPoints}\``, inline: true },
                    { name: '🔥 Streak', value: `\`${stats.streak} dias\``, inline: true },
                    { name: '⏳ Pendentes', value: `\`${stats.pendingChallenges}\``, inline: true }
                )
                .addFields(
                    { name: '🎯 Desafios Discord', value: `\`${stats.discordChallenges}\``, inline: true },
                    { name: '💻 Atividades GoDevs', value: `\`${stats.goDevsActivities}\``, inline: true },
                    { name: '📊 Total Unificado', value: `\`${stats.totalUnified}\``, inline: true }
                )
                .addFields({
                    name: '🏆 Badges',
                    value: badgesList
                })
                .setFooter({ 
                    text: stats.lastSynced 
                        ? `Última sincronização GoDevs: ${new Date(stats.lastSynced).toLocaleDateString('pt-BR')}`
                        : 'GoDevs não sincronizado — use /atualizar'
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

            // Lista as 5 atividades mais recentes
            const recentActivities = activities.slice(0, 5).map((a, i) => 
                `${i + 1}. **${a.lesson_name || 'Sem nome'}** (${a.tipo_atividade})`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Sincronização Concluída!')
                .setDescription(`**${count}** atividades do GoDevs foram sincronizadas com sucesso!`)
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
