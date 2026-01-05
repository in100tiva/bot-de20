import cron from 'node-cron';
import { Client, TextChannel, EmbedBuilder, ChannelType } from 'discord.js';
import { dailyChallenges } from './challenges.js';
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.resolve('sorteio.json');

const getStatusSorteio = () => {
    if (!fs.existsSync(STORAGE_PATH)) return { usados: [] };
    try {
        return JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
    } catch (e) {
        return { usados: [] };
    }
};

const salvarStatusSorteio = (usados: number[]) => {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify({ usados }));
};

export const postarDesafio = async (client: Client, idManual: number | null = null) => {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const channel = guild.channels.cache.find(
        ch => (ch.name === 'desafio' || ch.name === 'desafios') && ch.isTextBased()
    ) as TextChannel;

    if (channel) {
        let challenge;
        const status = getStatusSorteio();
        let IDsUsados: number[] = status.usados;

        if (idManual) {
            challenge = dailyChallenges.find(c => c.id === idManual);
        } else {
            const disponiveis = dailyChallenges.filter(c => !IDsUsados.includes(c.id));

            if (disponiveis.length === 0) {
                console.log("♻️ Ciclo completo. Resetando IDs usados...");
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
            .addFields({ 
                name: '🛠️ Requisitos Técnicos:', 
                value: challenge.requirements.map(req => `• ${req}`).join('\n')
            })
            .addFields(
                { name: '📊 Dificuldade:', value: `\`${challenge.difficulty}\``, inline: true },
                { name: '🔗 Entrega:', value: '[Portal GoDevs](https://godevs.in100tiva.com)', inline: true }
            )
            .setFooter({ text: `Desafio ${challenge.id} de ${dailyChallenges.length} • GoDevs` })
            .setTimestamp();

        const mensagemEnviada = await channel.send({ 
            content: '# 📢 ATENÇÃO GODEVS!\nNovo desafio de construção liberado. Quem aceita a missão?', 
            embeds: [embed] 
        });

        // Correção do erro TS2367: Usando o Enum oficial do Discord.js
        if (channel.type === ChannelType.GuildAnnouncement) {
            await mensagemEnviada.crosspost().catch(() => null);
        }
    }
};

export const startScheduler = (client: Client) => {
    // Horário atualizado para 02:40
    // Correção do erro TS2353: Removido 'scheduled: true' que não existe mais na tipagem
    cron.schedule('0 40 2 * * *', async () => {
        console.log("⏰ Disparando postagem automática (02:40)...");
        await postarDesafio(client);
    }, {
        timezone: "America/Sao_Paulo"
    });
};