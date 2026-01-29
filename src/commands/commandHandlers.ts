import { ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonInteraction } from 'discord.js';
import { postarDesafio } from '../utils/scheduler.js';
import { dailyChallenges } from '../utils/challenges.js';
import { prisma, userService, goDevsActivityService, badgeService } from '../lib/prisma.js';
import { fetchGoDevsActivities, checkDiscordIdInGoDevs } from '../lib/supabase.js';
import { announceMultipleAchievements, announceMilestone, createProfileButtons, createRankingButtons } from '../utils/announcements.js';

// Comandos que só admins podem usar
const ADMIN_ONLY_COMMANDS = ['desafio', 'status', 'adicionar', 'limpar', 'agenda'];

// Verifica se o usuário é administrador
const isAdmin = (interaction: ChatInputCommandInteraction): boolean => {
    return interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) ?? false;
};

export const handleSlashCommands = async (interaction: ChatInputCommandInteraction, client: Client) => {
    const { commandName } = interaction;

    // 🔒 Verifica permissão para comandos de admin
    if (ADMIN_ONLY_COMMANDS.includes(commandName) && !isAdmin(interaction)) {
        await interaction.reply({
            content: '🔒 **Acesso Negado**\n\nEste comando é exclusivo para administradores do servidor.\n\n**Comandos disponíveis para você:**\n• `/ranking` - Ver o ranking de usuários\n• `/perfil` - Ver seu perfil e estatísticas\n• `/atualizar` - Sincronizar atividades do GoDevs',
            ephemeral: true
        });
        return;
    }

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
            // Responde em até 3s para o Discord; consulta ao banco pode demorar
            await interaction.deferReply({ ephemeral: true });

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

            await interaction.editReply({ embeds: [embed] });
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

            await interaction.deferReply({ ephemeral: true });

            // 🔥 VERIFICA NO BANCO DE DADOS
            const alreadyPosted = await prisma.dailyPost.findFirst({
                where: { challengeId: id }
            });

            if (alreadyPosted) {
                await interaction.editReply({
                    content: `⚠️ O desafio #${id} já foi postado em ${new Date(alreadyPosted.postedAt).toLocaleDateString()}!`
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

            await interaction.editReply({
                content: `✅ Desafio #${id} marcado como enviado no banco de dados!`
            });
        }

        else if (commandName === 'limpar') {
            await interaction.deferReply({ ephemeral: true });

            // 🔥 LIMPA O BANCO DE DADOS
            const deleted = await prisma.dailyPost.deleteMany({});
            
            await interaction.editReply({
                content: `✅ Histórico de desafios limpo! ${deleted.count} registros removidos do banco de dados. Todos os desafios estão disponíveis novamente.`
            });
        }

        else if (commandName === 'agenda') {
            const nextDesafio = getNextCronTime(2, 40);
            const nextRanking = getNextCronTime(14, 30);
            
            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('⏰ Agendamentos Automáticos')
                .setDescription('Informações sobre as postagens automáticas do bot')
                .addFields({
                    name: '📢 Desafio Diário',
                    value: `🕐 **Horário:** \`02:40\` (Brasília)\n📅 **Frequência:** Todos os dias\n⏳ **Próximo:** ${nextDesafio}\n📍 **Canal:** \`#desafio\``,
                    inline: false
                })
                .addFields({
                    name: '🏆 Ranking Diário',
                    value: `🕐 **Horário:** \`14:30\` (Brasília)\n📅 **Frequência:** Todos os dias\n⏳ **Próximo:** ${nextRanking}\n📍 **Canal:** \`#geral\``,
                    inline: false
                })
                .addFields({
                    name: 'ℹ️ Como funciona',
                    value: '• **Desafio:** Seleciona automaticamente um desafio não enviado e posta no canal\n• **Ranking:** Mostra o TOP 3 usuários com mais atividades'
                })
                .setFooter({ text: 'Timezone: America/Sao_Paulo' })
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

            // 🔘 Adiciona botões interativos
            const buttons = createRankingButtons();

            await interaction.editReply({ embeds: [embed], components: [buttons] });
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
            
            // 🔥 Busca posição no ranking
            const rankingPosition = await userService.getRankingPosition(targetUser.id);
            const totalUsers = await userService.getTotalUsers();

            const badgesList = stats.badges.length > 0 
                ? stats.badges.map(ub => `${ub.badge.icon} ${ub.badge.name}`).join(', ')
                : '_Nenhuma badge conquistada_';

            // 🔥 Monta barra de progresso para próxima badge
            let nextBadgeText = '🏆 **Todas as badges conquistadas!**';
            if (stats.nextBadge) {
                const { icon, name, remaining, progress } = stats.nextBadge;
                const progressBar = createProgressBar(progress);
                nextBadgeText = `${icon} **${name}** — faltam ${remaining} atividades\n${progressBar} ${progress}%`;
            }

            const embed = new EmbedBuilder()
                .setColor(discordIdInGoDevs ? 0x5865F2 : 0xFFA500) // Laranja se não vinculado
                .setTitle(`📊 Perfil de ${profile.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
                .addFields(
                    { name: '🏅 Posição', value: `\`#${rankingPosition}\` de ${totalUsers}`, inline: true },
                    { name: '🔥 Streak', value: `\`${stats.streak} dias\``, inline: true },
                    { name: '💻 Atividades', value: `\`${stats.goDevsActivities}\``, inline: true }
                )
                .addFields(
                    { name: '🎖️ Badges Conquistadas', value: badgesList, inline: false }
                )
                .addFields(
                    { name: '⏳ Próxima Conquista', value: nextBadgeText, inline: false }
                );

            // Adiciona aviso se não vinculado
            if (!discordIdInGoDevs && !checkError) {
                embed.addFields({
                    name: '⚠️ Vincule seu Discord',
                    value: `[Portal GoDevs](https://godevs.in100tiva.com) → Perfil → Discord ID: \`${targetUser.id}\``
                });
            }
            
            embed.setFooter({ 
                text: stats.lastSynced 
                    ? `Sincronizado: ${new Date(stats.lastSynced).toLocaleDateString('pt-BR')}`
                    : 'Nunca sincronizado'
            })
            .setTimestamp();

            // 🔘 Adiciona botões interativos
            const buttons = createProfileButtons(isOwnProfile);

            await interaction.editReply({ embeds: [embed], components: [buttons] });
        }

        else if (commandName === 'atualizar') {
            await interaction.deferReply({ ephemeral: true });

            const discordId = interaction.user.id;
            const username = interaction.user.username;

            // Busca ou cria o usuário
            const user = await userService.findOrCreate(discordId, username);

            // 🔒 COOLDOWN: Verifica se passou 5 minutos desde última sincronização
            const COOLDOWN_MINUTES = 5;
            if (user.lastSyncedAt) {
                const lastSync = new Date(user.lastSyncedAt);
                const now = new Date();
                const diffMs = now.getTime() - lastSync.getTime();
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                
                if (diffMinutes < COOLDOWN_MINUTES) {
                    const remainingMinutes = COOLDOWN_MINUTES - diffMinutes;
                    const remainingSeconds = Math.ceil((COOLDOWN_MINUTES * 60 * 1000 - diffMs) / 1000) % 60;
                    
                    await interaction.editReply({
                        content: `⏳ **Aguarde antes de sincronizar novamente!**\n\n` +
                            `Você pode usar \`/atualizar\` a cada **${COOLDOWN_MINUTES} minutos**.\n\n` +
                            `🕐 **Última sincronização:** há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}\n` +
                            `⏱️ **Tempo restante:** ${remainingMinutes}m ${remainingSeconds}s\n\n` +
                            `_Use \`/perfil\` para ver suas estatísticas atuais._`
                    });
                    return;
                }
            }

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

            // Guarda count anterior para verificar milestones
            const previousCount = user.goDevsActivitiesCount || 0;

            // Sincroniza atividades para o cache local
            await goDevsActivityService.syncActivities(user.id, activities);
            
            // 🔥 Passa atividades para calcular streak real
            const activitiesWithDates = activities.map(a => ({ 
                submittedAt: new Date(a.created_at) 
            }));
            await userService.updateGoDevsCount(discordId, count, activitiesWithDates);

            // 🏆 Garante que badges existem e verifica conquistas
            await badgeService.ensureBadgesExist();
            const newBadges = await badgeService.checkAndAward(user.id, count);
            
            // Se conquistou novas badges, anuncia no canal #conquistas
            if (newBadges.length > 0) {
                await announceMultipleAchievements(client, interaction.user, newBadges);
            }

            // 🎊 Verifica e anuncia milestones (10, 25, 50, 100 atividades)
            await announceMilestone(client, interaction.user, previousCount, count);

            // Busca perfil atualizado para mostrar streak
            const updatedProfile = await userService.getFullProfile(discordId);
            const streak = updatedProfile?.stats.streak || 0;

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
                .addFields(
                    { name: '🔥 Streak Atual', value: `\`${streak} dias\``, inline: true },
                    { name: '💻 Total Atividades', value: `\`${count}\``, inline: true }
                )
                .addFields({
                    name: '📋 Atividades Recentes',
                    value: recentActivities || '_Nenhuma_'
                })
                .setFooter({ text: 'Use /perfil para ver estatísticas completas' })
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

function getNextCronTime(hour: number = 2, minute: number = 40): string {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Define para o horário especificado de hoje
    nextRun.setHours(hour, minute, 0, 0);
    
    // Se já passou do horário, agenda para amanhã
    if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)) {
        nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const diff = nextRun.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `<t:${Math.floor(nextRun.getTime() / 1000)}:R> (~${hours}h ${minutes}m)`;
}

// 🔥 Cria barra de progresso visual
function createProgressBar(percentage: number): string {
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    const filledChar = '█';
    const emptyChar = '░';
    return filledChar.repeat(filled) + emptyChar.repeat(empty);
}

// 🔘 Handler para botões interativos
export const handleButtonInteraction = async (interaction: ButtonInteraction, client: Client) => {
    const { customId } = interaction;

    try {
        // 🔄 Botão "Atualizar" ou "Sincronizar"
        if (customId === 'btn_update_profile') {
            await interaction.deferReply({ ephemeral: true });
            
            const discordId = interaction.user.id;
            const username = interaction.user.username;
            
            const user = await userService.findOrCreate(discordId, username);
            
            // Verifica cooldown
            const COOLDOWN_MINUTES = 5;
            if (user.lastSyncedAt) {
                const diffMs = Date.now() - new Date(user.lastSyncedAt).getTime();
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                
                if (diffMinutes < COOLDOWN_MINUTES) {
                    const remaining = COOLDOWN_MINUTES - diffMinutes;
                    await interaction.editReply({
                        content: `⏳ Aguarde **${remaining} minutos** antes de sincronizar novamente.`
                    });
                    return;
                }
            }

            const { activities, count, error } = await fetchGoDevsActivities(discordId);
            
            if (error || count === 0) {
                await interaction.editReply({
                    content: error ? `❌ Erro: ${error}` : '📭 Nenhuma atividade encontrada.'
                });
                return;
            }

            await goDevsActivityService.syncActivities(user.id, activities);
            const activitiesWithDates = activities.map(a => ({ submittedAt: new Date(a.created_at) }));
            await userService.updateGoDevsCount(discordId, count, activitiesWithDates);

            await interaction.editReply({
                content: `✅ **${count} atividades** sincronizadas! Use \`/perfil\` para ver suas estatísticas.`
            });
        }

        // 📊 Botão "Ver Ranking"
        else if (customId === 'btn_view_ranking' || customId === 'btn_ranking_full') {
            await interaction.deferReply({ ephemeral: true });
            
            const ranking = await userService.getFullRanking(10);
            
            if (ranking.length === 0) {
                await interaction.editReply({ content: '📊 Nenhum usuário no ranking ainda!' });
                return;
            }

            const medals = ['🥇', '🥈', '🥉'];
            const rankingList = ranking.map((user, index) => {
                const medal = medals[index] || `**${index + 1}.**`;
                return `${medal} **${user.username}** — 📊 ${user.goDevsActivitiesCount} atividades`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('🏆 Ranking GoDevs')
                .setDescription(rankingList)
                .setFooter({ text: `Top ${ranking.length} usuários` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        // 👤 Botão "Meu Perfil"
        else if (customId === 'btn_my_profile') {
            await interaction.deferReply({ ephemeral: true });
            
            const profile = await userService.getFullProfile(interaction.user.id);
            
            if (!profile) {
                await userService.findOrCreate(interaction.user.id, interaction.user.username);
                await interaction.editReply({
                    content: '✅ Perfil criado! Use `/perfil` para ver suas estatísticas ou `/atualizar` para sincronizar atividades.'
                });
                return;
            }

            const { stats } = profile;
            const position = await userService.getRankingPosition(interaction.user.id);
            const total = await userService.getTotalUsers();

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`📊 ${profile.username}`)
                .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
                .addFields(
                    { name: '🏅 Posição', value: `#${position} de ${total}`, inline: true },
                    { name: '🔥 Streak', value: `${stats.streak} dias`, inline: true },
                    { name: '💻 Atividades', value: `${stats.goDevsActivities}`, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

    } catch (error: any) {
        console.error('Erro no botão:', error);
        
        if (interaction.deferred) {
            await interaction.editReply({ content: `❌ Erro: ${error.message}` });
        } else {
            await interaction.reply({ content: `❌ Erro: ${error.message}`, ephemeral: true });
        }
    }
};
