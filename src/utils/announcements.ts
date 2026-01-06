import { Client, EmbedBuilder, TextChannel, User, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

// Milestones para anunciar
const MILESTONES = [10, 25, 50, 100];

// Títulos para cada milestone
const MILESTONE_TITLES: Record<number, { title: string; emoji: string }> = {
  10: { title: 'DEDICADO', emoji: '⚡' },
  25: { title: 'VETERANO', emoji: '🎖️' },
  50: { title: 'LENDA', emoji: '🏆' },
  100: { title: 'MITO ABSOLUTO', emoji: '👑' },
};

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

/**
 * 🎊 Anuncia milestone quando usuário atinge 10, 25, 50, 100 atividades
 */
export async function announceMilestone(
  client: Client,
  discordUser: User,
  previousCount: number,
  newCount: number
): Promise<boolean> {
  // Verifica se cruzou algum milestone
  const crossedMilestone = MILESTONES.find(
    milestone => previousCount < milestone && newCount >= milestone
  );

  if (!crossedMilestone) return false;

  const guild = client.guilds.cache.first();
  if (!guild) return false;

  const channel = guild.channels.cache.find(
    ch => (ch.name === 'conquistas' || ch.name === 'achievements') && ch.isTextBased()
  ) as TextChannel | undefined;

  if (!channel) return false;

  const milestoneInfo = MILESTONE_TITLES[crossedMilestone] || { title: 'INCRÍVEL', emoji: '🌟' };

  try {
    const embed = new EmbedBuilder()
      .setColor(0xFF6B6B) // Vermelho vibrante para milestones
      .setTitle(`${milestoneInfo.emoji} ${crossedMilestone} ATIVIDADES!`)
      .setDescription(`**${discordUser.username}** atingiu **${crossedMilestone} atividades** no GoDevs!\n\nEle agora é um **${milestoneInfo.title}**!`)
      .setThumbnail(discordUser.displayAvatarURL({ size: 256 }))
      .setImage('https://media.giphy.com/media/g9582DNuQppxC/giphy.gif') // GIF de celebração
      .setFooter({ text: 'Continue assim! 🔥' })
      .setTimestamp();

    await channel.send({
      content: `# 🎊 MILESTONE ATINGIDO!\n\n<@${discordUser.id}> é **${milestoneInfo.title}** no GoDevs!`,
      embeds: [embed]
    });

    console.log(`🎊 Milestone ${crossedMilestone} anunciado para ${discordUser.username}!`);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao anunciar milestone:', error.message);
    return false;
  }
}

/**
 * 📊 Posta o TOP 3 diário no canal #geral
 */
export async function postWeeklyTop3(
  client: Client,
  ranking: Array<{ username: string; goDevsActivitiesCount: number; streak: number }>
): Promise<boolean> {
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('❌ Nenhum servidor encontrado para postar ranking!');
    return false;
  }

  // Busca canal geral (prioriza "geral", depois "general", depois "chat")
  const channel = guild.channels.cache.find(
    ch => (ch.name === 'geral' || ch.name === 'general' || ch.name === 'chat') && ch.isTextBased()
  ) as TextChannel | undefined;

  if (!channel) {
    console.warn('⚠️ Canal #geral não encontrado! Crie um canal chamado "geral".');
    return false;
  }

  if (ranking.length === 0) {
    console.log('📊 Nenhum usuário no ranking para postar.');
    return false;
  }

  try {
    const medals = ['🥇', '🥈', '🥉'];
    const top3 = ranking.slice(0, 3);
    
    const rankingList = top3.map((user, index) => {
      return `${medals[index]} **${user.username}** — ${user.goDevsActivitiesCount} atividades | 🔥 ${user.streak} dias de streak`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('📊 TOP 3 DO DIA')
      .setDescription(rankingList)
      .addFields({
        name: '🚀 Quer aparecer aqui?',
        value: 'Entregue atividades no [Portal GoDevs](https://godevs.in100tiva.com) e use `/atualizar` para sincronizar!'
      })
      .setFooter({ text: 'Atualizado todos os dias às 14:30' })
      .setTimestamp();

    // Botão para ver ranking completo
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_ranking_full')
          .setLabel('Ver Ranking Completo')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('📊')
      );

    await channel.send({
      content: '# 🏆 RANKING DIÁRIO GODEVS',
      embeds: [embed],
      components: [row]
    });

    console.log('📊 TOP 3 diário postado com sucesso!');
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao postar ranking semanal:', error.message);
    return false;
  }
}

/**
 * 🔘 Cria botões para o embed de perfil
 */
export function createProfileButtons(isOwnProfile: boolean): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();

  if (isOwnProfile) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('btn_update_profile')
        .setLabel('Atualizar')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔄'),
      new ButtonBuilder()
        .setCustomId('btn_view_ranking')
        .setLabel('Ver Ranking')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📊')
    );
  } else {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('btn_my_profile')
        .setLabel('Meu Perfil')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('👤'),
      new ButtonBuilder()
        .setCustomId('btn_view_ranking')
        .setLabel('Ver Ranking')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📊')
    );
  }

  return row;
}

/**
 * 🔘 Cria botões para o embed de ranking
 */
export function createRankingButtons(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_my_profile')
        .setLabel('Meu Perfil')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('👤'),
      new ButtonBuilder()
        .setCustomId('btn_update_profile')
        .setLabel('Sincronizar')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔄')
    );
}

