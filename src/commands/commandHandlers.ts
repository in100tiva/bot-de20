import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { postarDesafio, getStatusSorteio, salvarStatusSorteio, limparHistorico } from '../utils/scheduler.js';
import { dailyChallenges } from '../utils/challenges.js';

export const handleSlashCommands = async (interaction: ChatInputCommandInteraction, client: Client) => {
    const { commandName } = interaction;

    try {
        if (commandName === 'desafio') {
            const id = interaction.options.get('id')?.value as number | undefined;
            
            await interaction.deferReply({ ephemeral: true });
            await postarDesafio(client, id || null);
            
            await interaction.editReply({
                content: id 
                    ? `✅ Desafio #${id} enviado com sucesso!`
                    : '✅ Desafio aleatório enviado com sucesso!'
            });
        }

        else if (commandName === 'status') {
            const status = getStatusSorteio();
            const usados = status.usados || [];
            const total = dailyChallenges.length;
            const restantes = total - usados.length;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('📊 Status dos Desafios')
                .setDescription(`Sistema de desafios automáticos do GoDevs`)
                .addFields(
                    { name: '📝 Total de Desafios', value: `\`${total}\``, inline: true },
                    { name: '✅ Já Enviados', value: `\`${usados.length}\``, inline: true },
                    { name: '⏳ Restantes', value: `\`${restantes}\``, inline: true }
                )
                .addFields({
                    name: '🔢 IDs Enviados:',
                    value: usados.length > 0 
                        ? usados.sort((a: number, b: number) => a - b).map((id: number) => `\`${id}\``).join(', ')
                        : '_Nenhum desafio enviado ainda_'
                })
                .setFooter({ text: 'Use /desafio para enviar manualmente' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        else if (commandName === 'adicionar') {
            const id = interaction.options.get('id')?.value as number;
            
            if (!dailyChallenges.find(c => c.id === id)) {
                await interaction.reply({
                    content: `❌ Desafio com ID \`${id}\` não existe! IDs válidos: 1 a ${dailyChallenges.length}`,
                    ephemeral: true
                });
                return;
            }

            const status = getStatusSorteio();
            const usados = status.usados || [];

            if (usados.includes(id)) {
                await interaction.reply({
                    content: `⚠️ O desafio #${id} já está marcado como enviado!`,
                    ephemeral: true
                });
                return;
            }

            usados.push(id);
            salvarStatusSorteio(usados);

            await interaction.reply({
                content: `✅ Desafio #${id} adicionado ao histórico de enviados!`,
                ephemeral: true
            });
        }

        else if (commandName === 'limpar') {
            limparHistorico();
            await interaction.reply({
                content: '✅ Histórico de desafios limpo! Todos os desafios estão disponíveis novamente.',
                ephemeral: true
            });
        }

        else if (commandName === 'agenda') {
            const nextRun = getNextCronTime();
            
            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('⏰ Agendamento Automático')
                .setDescription('Informações sobre o sistema de postagens automáticas')
                .addFields(
                    { name: '🕐 Horário', value: '`02:40` (Horário de Brasília)', inline: true },
                    { name: '🌍 Timezone', value: '`America/Sao_Paulo`', inline: true },
                    { name: '📅 Frequência', value: '`Todos os dias`', inline: true }
                )
                .addFields({
                    name: '⏳ Próxima Execução',
                    value: nextRun
                })
                .addFields({
                    name: 'ℹ️ Como funciona',
                    value: 'O bot seleciona automaticamente um desafio que ainda não foi enviado e posta no canal #desafio'
                })
                .setFooter({ text: 'Use /desafio para postar manualmente a qualquer momento' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

    } catch (error: any) {
        console.error('Erro ao executar comando:', error);
        
        const errorMessage = {
            content: `❌ Erro ao executar o comando: ${error.message}`,
            ephemeral: true
        };

        if (interaction.deferred) {
            await interaction.editReply(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
};

function getNextCronTime(): string {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Define para 02:40 de hoje
    nextRun.setHours(2, 40, 0, 0);
    
    // Se já passou das 02:40, agenda para amanhã
    if (now.getHours() > 2 || (now.getHours() === 2 && now.getMinutes() >= 40)) {
        nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const diff = nextRun.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `<t:${Math.floor(nextRun.getTime() / 1000)}:R> (em ~${hours}h ${minutes}m)`;
}

