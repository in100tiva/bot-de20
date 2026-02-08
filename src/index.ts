import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';
import { startScheduler, postarDesafio } from './utils/scheduler.js';
import { handleSlashCommands, handleButtonInteraction } from './commands/commandHandlers.js';
import { badgeService } from './lib/prisma.js';

dotenv.config();

// Evita que o processo caia por erros não tratados (ex.: DB fora, timeout no cron)
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ unhandledRejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('⚠️ uncaughtException:', err.message || err);
});

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

client.once('clientReady', async (c) => {
    console.log(`✅ Logado como ${c.user.tag}`);
    console.log(`🎯 Servidores: ${c.guilds.cache.size}`);
    
    // Garante que as badges existem no banco de dados
    try {
        await badgeService.ensureBadgesExist();
        console.log('🏆 Sistema de badges inicializado');
    } catch (error) {
        console.error('⚠️ Erro ao inicializar badges:', error);
    }
    
    startScheduler(client);
});

// Comandos Slash (/) e Botões
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommands(interaction, client);
            return;
        }
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction, client);
            return;
        }
    } catch (err: any) {
        console.error('❌ Erro em interactionCreate:', err?.message || err);
        try {
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Ocorreu um erro. Tente novamente.' }).catch(() => null);
            } else if (!interaction.replied) {
                await interaction.reply({ content: '❌ Ocorreu um erro. Tente novamente.', ephemeral: true }).catch(() => null);
            }
        } catch (_) {}
    }
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
