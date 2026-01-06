import cron from 'node-cron';
import { Client, EmbedBuilder, ChannelType } from 'discord.js';
import { dailyChallenges } from './challenges.js';
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.resolve('sorteio.json');

const getStatusSorteio = () => {
    if (!fs.existsSync(STORAGE_PATH)) return { usados: [] };
    try { return JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8')); } 
    catch (e) { return { usados: [] }; }
};

const salvarStatusSorteio = (usados: number[]) => {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify({ usados }));
};

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
        const status = getStatusSorteio();
        let IDsUsados: number[] = status.usados;

        if (idManual) {
            challenge = dailyChallenges.find(c => c.id === idManual);
        } else {
            const disponiveis = dailyChallenges.filter(c => !IDsUsados.includes(c.id));
            if (disponiveis.length === 0) {
                IDsUsados = [];
                challenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
            } else {
                challenge = disponiveis[Math.floor(Math.random() * disponiveis.length)];
            }
            if (challenge) {
                IDsUsados.push(challenge.id);
                salvarStatusSorteio(IDsUsados);
            }
        }

        if (!challenge) return;

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

        console.log(`✅ Desafio "${challenge.title}" postado com sucesso!`);

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
    cron.schedule('0 40 2 * * *', async () => {
        console.log("⏰ Disparando postagem automática (02:40)...");
        await postarDesafio(client);
    }, { timezone: "America/Sao_Paulo" });
};