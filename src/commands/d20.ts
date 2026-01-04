import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { rollDice, getVisualData, rollHistory } from '../utils/dice.js';

export const handleD20Command = async (input: Message | ButtonInteraction) => {
    const result = rollDice(20);
    const visual = getVisualData(result);
    const user = input instanceof Message ? input.author : input.user;

    // Formata o histórico para exibição
    const historyText = rollHistory.length > 1 
        ? rollHistory.slice(1).map(n => `\`${n}\``).join(' → ') 
        : 'Nenhuma rolagem anterior.';

    const embed = new EmbedBuilder()
        .setColor(visual.color)
        .setAuthor({ 
            name: `Crônicas de ${user.username}`, 
            iconURL: user.displayAvatarURL() 
        })
        .setTitle(visual.title)
        .setDescription(result.type === 'CRITICO' ? '***Os deuses sorriem para você!***' : null)
        .addFields(
            { name: 'Dado', value: '`1d20`', inline: true },
            { name: 'Resultado', value: `${visual.emoji} **${result.value}**`, inline: true },
            { name: '📜 Histórico Recente (Últimos 5)', value: historyText }
        )
        .setThumbnail(result.value === 20 ? 'https://i.imgur.com/7S8Inz0.png' : 'https://i.imgur.com/9XpX3iV.png')
        .setFooter({ text: 'D20 System • RPG Master' })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('roll_again')
                .setLabel('Rolar Novamente')
                .setStyle(result.value === 20 ? ButtonStyle.Success : ButtonStyle.Primary)
                .setEmoji('🎲')
        );

    if (input instanceof Message) {
        await input.reply({ embeds: [embed], components: [row] });
    } else {
        // Usamos update para substituir a mensagem anterior em vez de criar uma nova
        // Isso deixa o chat mais limpo durante o histórico
        await input.update({ embeds: [embed], components: [row] });
    }
};