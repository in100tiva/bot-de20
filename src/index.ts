import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';
import { handleD20Command } from './commands/d20.js';

dotenv.config();

// --- PASSO 4: SERVIDOR PARA MANTER ONLINE 24H ---
// Isso cria uma página web simples que diz "Bot Online!"
// Útil para serviços como Render, Koyeb ou UptimeRobot.
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Bot D20 rodando com sucesso!");
    res.end();
}).listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// --- CONFIGURAÇÃO DO BOT ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', (c) => {
    console.log(`✅ Bot profissional online como ${c.user.tag}`);
});

// Escuta mensagens (Comando !d20)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Detecta o comando !d20 e permite bônus opcional (ex: !d20 + 5)
    if (message.content.toLowerCase().startsWith('!d20')) {
        await handleD20Command(message);
    }
});

// Escuta cliques em botões (Interações)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'roll_again') {
        // No botão, o "update" substitui a mensagem anterior
        await handleD20Command(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);