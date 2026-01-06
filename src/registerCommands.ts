import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import { commands } from './commands/slashCommands.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = '1457450454865940511'; // ID do seu bot

if (!token) {
    console.error('❌ DISCORD_TOKEN não encontrado no .env');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Registrando comandos slash...');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('✅ Comandos registrados com sucesso!');
        console.log(`📝 Total: ${commands.length} comandos`);
        commands.forEach((cmd: any) => console.log(`   /${cmd.name} - ${cmd.description}`));
        
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})();

