import { Client, EmbedBuilder, TextChannel, User } from 'discord.js';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

/**
 * Anuncia uma conquista no canal #conquistas
 */
export async function announceAchievement(
  client: Client,
  discordUser: User,
  badges: Badge[]
): Promise<boolean> {
  if (badges.length === 0) return false;

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('❌ Nenhum servidor encontrado para anunciar conquista!');
    return false;
  }

  // Busca o canal #conquistas
  const channel = guild.channels.cache.find(
    ch => (ch.name === 'conquistas' || ch.name === 'achievements') && ch.isTextBased()
  ) as TextChannel | undefined;

  if (!channel) {
    console.warn('⚠️ Canal #conquistas não encontrado! Crie um canal chamado "conquistas".');
    return false;
  }

  try {
    for (const badge of badges) {
      const embed = new EmbedBuilder()
        .setColor(0xFFD700) // Dourado para conquistas
        .setTitle('🏆 NOVA CONQUISTA DESBLOQUEADA!')
        .setDescription(`**${discordUser.username}** acabou de conquistar uma nova badge!`)
        .setThumbnail(discordUser.displayAvatarURL({ size: 128 }))
        .addFields(
          { name: `${badge.icon} ${badge.name}`, value: badge.description, inline: false },
          { name: '📊 Requisito', value: `${badge.requirement} atividades entregues`, inline: true }
        )
        .setFooter({ text: 'Continue entregando atividades para conquistar mais badges!' })
        .setTimestamp();

      await channel.send({
        content: `# 🎉 PARABÉNS <@${discordUser.id}>!`,
        embeds: [embed]
      });

      console.log(`🏆 Conquista "${badge.name}" anunciada para ${discordUser.username}!`);
    }

    return true;
  } catch (error: any) {
    console.error('❌ Erro ao anunciar conquista:', error.message);
    return false;
  }
}

/**
 * Anuncia múltiplas conquistas de uma vez (mais limpo)
 */
export async function announceMultipleAchievements(
  client: Client,
  discordUser: User,
  badges: Badge[]
): Promise<boolean> {
  if (badges.length === 0) return false;

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('❌ Nenhum servidor encontrado para anunciar conquista!');
    return false;
  }

  // Busca o canal #conquistas
  const channel = guild.channels.cache.find(
    ch => (ch.name === 'conquistas' || ch.name === 'achievements') && ch.isTextBased()
  ) as TextChannel | undefined;

  if (!channel) {
    console.warn('⚠️ Canal #conquistas não encontrado! Crie um canal chamado "conquistas".');
    return false;
  }

  try {
    const badgesList = badges.map(b => `${b.icon} **${b.name}** — ${b.description}`).join('\n');
    
    const embed = new EmbedBuilder()
      .setColor(0xFFD700) // Dourado para conquistas
      .setTitle(badges.length === 1 ? '🏆 NOVA CONQUISTA!' : `🏆 ${badges.length} NOVAS CONQUISTAS!`)
      .setDescription(`**${discordUser.username}** desbloqueou ${badges.length === 1 ? 'uma nova badge' : 'novas badges'}!`)
      .setThumbnail(discordUser.displayAvatarURL({ size: 128 }))
      .addFields({
        name: '🎖️ Badges Conquistadas',
        value: badgesList
      })
      .setFooter({ text: 'Entregue atividades no GoDevs para conquistar mais badges!' })
      .setTimestamp();

    await channel.send({
      content: `# 🎉 PARABÉNS <@${discordUser.id}>!`,
      embeds: [embed]
    });

    console.log(`🏆 ${badges.length} conquista(s) anunciada(s) para ${discordUser.username}!`);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao anunciar conquistas:', error.message);
    return false;
  }
}

