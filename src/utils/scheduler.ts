import cron from 'node-cron';
import { Client, EmbedBuilder, ChannelType } from 'discord.js';
import { dailyChallenges } from './challenges.js';
import { dailyPostService, userService } from '../lib/prisma.js';
import { postWeeklyTop3 } from './announcements.js';

export const postarDesafio = async (client: Client, idManual: number | null = null) => {
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('❌ Nenhum servidor encontrado!');
        return;
    }

    // Busca flexível para evitar erros de tipagem do TS
    const channel = guild.channels.cache.find(
        ch => (ch.name === 'desafio' || ch.name === 'desafios') && ch.isTextBased()
    );

    if (!channel) {
        console.error('❌ Canal #desafio não encontrado! Crie um canal chamado "desafio".');
        return;
    }

    if (channel && channel.isTextBased()) {
        try {
            let challenge;
            let challengeId: number;

            if (idManual) {
                // Busca desafio específico
                challenge = dailyChallenges.find(c => c.id === idManual);
                if (!challenge) {
                    console.error(`❌ Desafio #${idManual} não encontrado!`);
                    return;
                }
                challengeId = idManual;
            } else {
                // Busca desafios não postados no banco de dados
                const unpostedIds = await dailyPostService.getUnpostedIds(dailyChallenges.length);
                
                if (unpostedIds.length === 0) {
                    // Todos foram postados, reseta o histórico e escolhe aleatório
                    console.log('🔄 Todos os desafios foram postados! Resetando histórico...');
                    await dailyPostService.clearAllPosts();
                    const randomIndex = Math.floor(Math.random() * dailyChallenges.length);
                    challengeId = dailyChallenges[randomIndex]!.id;
                } else {
                    // Escolhe aleatório dos não postados
                    const randomIndex = Math.floor(Math.random() * unpostedIds.length);
                    const selectedId = unpostedIds[randomIndex];
                    if (selectedId === undefined) {
                        console.error('❌ Erro ao selecionar desafio!');
                        return;
                    }
                    challengeId = selectedId;
                }
                
                challenge = dailyChallenges.find(c => c.id === challengeId);
                if (!challenge) {
                    console.error(`❌ Desafio #${challengeId} não encontrado!`);
                    return;
                }
            }

            const embed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setTitle(`🚀 Missão do Dia: ${challenge.title}`)
                .setDescription(challenge.description)
                .addFields({ name: '🛠️ Requisitos Técnicos:', value: challenge.requirements.map(req => `• ${req}`).join('\n') })
                .addFields(
                    { name: '📊 Dificuldade:', value: `\`${challenge.difficulty}\``, inline: true },
                    { name: '🔗 Entrega:', value: '[Portal GoDevs](https://godevs.in100tiva.com)', inline: true }
                )
                .setFooter({ text: `Desafio ${challenge.id} de ${dailyChallenges.length} • GoDevs` })
                .setTimestamp();

            const mensagemEnviada = await channel.send({ 
                content: '# 📢 ATENÇÃO GODEVS!\nNovo desafio de construção liberado!', 
                embeds: [embed] 
            });

            // 🔥 REGISTRA NO BANCO DE DADOS (sem foreign key para tabela challenges)
            await dailyPostService.recordDailyPost(
                challenge.id,
                channel.id,
                mensagemEnviada.id
            );

            console.log(`✅ Desafio "${challenge.title}" postado com sucesso!`);
            console.log(`📊 Registrado no banco de dados: Challenge #${challenge.id}`);

            // Burlar trava de tipo para Crosspost em canais de anúncio
            if (channel.type === (ChannelType.GuildAnnouncement as any)) {
                await mensagemEnviada.crosspost().catch(() => null);
            }
        } catch (error: any) {
            if (error.code === 50013) {
                console.error('❌ ERRO DE PERMISSÃO: O bot não tem permissão para enviar mensagens no canal #desafio!');
                console.error('➡️ Solução 1: Dê permissão "Enviar Mensagens" ao bot no canal');
                console.error('➡️ Solução 2: Se for News Channel, converta para canal de texto normal');
                console.error(`➡️ ID do Canal: ${channel.id}`);
            } else {
                console.error('❌ Erro ao postar desafio:', error.message);
            }
        }
    }
};

export const startScheduler = (client: Client) => {
    console.log('⏰ Agendador inicializado:');
    console.log('   📅 Desafio Diário: 02:40 (todos os dias)');
    console.log('   📊 Ranking Diário: 14:30 (todos os dias)');
    console.log('   🌍 Timezone: America/Sao_Paulo');
    
    // 📅 Desafio diário às 02:40
    cron.schedule('0 40 2 * * *', async () => {
        try {
            console.log("⏰ Disparando postagem automática (02:40)...");
            await postarDesafio(client);
        } catch (error: any) {
            console.error('❌ Erro no cron de desafio (02:40):', error?.message || error);
        }
    }, { 
        timezone: "America/Sao_Paulo"
    });

    // 📊 TOP 3 diário às 14:30
    cron.schedule('0 30 14 * * *', async () => {
        try {
            console.log("📊 Disparando ranking diário (14:30)...");
            const ranking = await userService.getFullRanking(10);
            await postWeeklyTop3(client, ranking);
        } catch (error: any) {
            console.error('❌ Erro ao postar ranking:', error?.message || error);
        }
    }, { 
        timezone: "America/Sao_Paulo"
    });
    
    console.log('✅ Cron jobs ativos e aguardando próximas execuções!');
};

// Função para postar ranking manualmente (para testes)
export const postarRankingSemanal = async (client: Client) => {
    try {
        const ranking = await userService.getFullRanking(10);
        await postWeeklyTop3(client, ranking);
        return true;
    } catch (error: any) {
        console.error('❌ Erro ao postar ranking:', error.message);
        return false;
    }
};