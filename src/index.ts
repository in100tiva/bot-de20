import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';
import { startScheduler, postarDesafio } from './utils/scheduler.js';
import { handleSlashCommands } from './commands/commandHandlers.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("🤖 GoDevs Challenge Bot Online!\n\n");
    res.write("Status: Ativo\n");
    res.write("Comandos: /desafio, /status, /adicionar, /limpar, /agenda\n");
    res.end();
}).listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', (c) => {
    console.log(`✅ Logado como ${c.user.tag}`);
    console.log(`🎯 Servidores: ${c.guilds.cache.size}`);
    startScheduler(client);
});

// Comandos Slash (/)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await handleSlashCommands(interaction, client);
});

// Comando legado (!desafio) - mantido para compatibilidade
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith('!desafio')) {
        const args = message.content.split(' ');
        const idManual = args[1] ? parseInt(args[1]) : null;
        try { if (message.deletable) await message.delete(); } catch (e) {}
        await postarDesafio(client, idManual);
    }
});

client.login(process.env.DISCORD_TOKEN);
