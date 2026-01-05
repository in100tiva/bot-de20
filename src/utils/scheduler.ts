import cron from 'node-cron';
import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { dailyChallenges } from './challenges.js';

// Função isolada que escolhe e posta o desafio
export const postarDesafio = async (client: Client) => {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const channel = guild.channels.cache.find(
        ch => ch.name === 'desafio' && ch.isTextBased()
    ) as TextChannel;

    if (channel) {
        const challenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle(`🚀 Missão do Dia: ${challenge?.title}`)
            .setDescription(challenge?.description || "")
            .addFields({ 
                name: '🛠️ Requisitos Técnicos:', 
                value: challenge?.requirements.map(req => `• ${req}`).join('\n') || "Nenhum requisito listado."
            })
            .addFields({ 
                name: '📊 Dificuldade:', 
                value: `\`${challenge?.difficulty}\``, inline: true 
            })
            .addFields({ 
                name: '🔗 Entrega:', 
                value: '[Portal GoDevs](https://godevs.in100tiva.com)', inline: true 
            })
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/1085/1085469.png')
            .setFooter({ text: 'Daily Challenge • Foco em Landing Pages' })
            .setTimestamp();

        await channel.send({ 
            content: '# 📢 ATENÇÃO GODEVS!\nNovo desafio de construção liberado. Quem aceita a missão?', 
            embeds: [embed] 
        });
    }
};

// Agendador automático
export const startScheduler = (client: Client) => {
    cron.schedule('0 0 9 * * *', async () => {
        console.log("Executando postagem agendada das 09h...");
        await postarDesafio(client);
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
};