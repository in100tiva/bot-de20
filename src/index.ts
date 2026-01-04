import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleD20Command } from './commands/d20.js';

dotenv.config();

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
    if (message.content.toLowerCase() === '!d20') {
        await handleD20Command(message);
    }
});

// Escuta cliques em botões
client.on('interactionCreate', async (interaction) => {
    // Se não for um botão, ignora
    if (!interaction.isButton()) return;

    // Se for o botão de rolar novamente
    if (interaction.customId === 'roll_again') {
        // Chamamos a mesma função, mas passamos a interação
        // Vamos ajustar o handleD20Command para aceitar ambos
        await handleD20Command(interaction as any); 
    }
});

client.login(process.env.DISCORD_TOKEN);