import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';
import { startScheduler, postarDesafio } from './utils/scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Bot de Desafios GoDevs Online!");
    res.end();
}).listen(PORT);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Reativado para ler o comando !desafio
    ]
});

client.once('ready', (c) => {
    console.log(`✅ Logado como ${c.user.tag}`);
    startScheduler(client);
    console.log("⏰ Cron iniciado: Postagens diárias às 09:00.");
});

// Listener para o comando manual
client.on('messageCreate', async (message) => {
    // Impede o bot de responder a si mesmo ou a outros bots
    if (message.author.bot) return;

    // Se você digitar !desafio no canal
    if (message.content.toLowerCase() === '!desafio') {
        console.log(`Manual: Desafio solicitado por ${message.author.username}`);
        await postarDesafio(client);
        
        // Opcional: deleta a mensagem do comando para manter o canal limpo
        if (message.deletable) {
            await message.delete().catch(() => null);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);