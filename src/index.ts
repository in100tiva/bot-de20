import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';
import { startScheduler, postarDesafio } from './utils/scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Bot GoDevs Ativo!");
    res.end();
}).listen(PORT);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', (c) => {
    console.log(`✅ Logado como ${c.user.tag}`);
    startScheduler(client);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!desafio')) {
        const args = message.content.split(' ');
        const idManual = args[1] ? parseInt(args[1]) : null;

        try {
            if (message.deletable) await message.delete();
        } catch (e) {}

        await postarDesafio(client, idManual);
    }
});

client.login(process.env.DISCORD_TOKEN);