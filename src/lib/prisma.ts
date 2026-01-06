import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Singleton para o Prisma Client com Accelerate
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Funções auxiliares para Usuários
export const userService = {
  // Cria ou retorna usuário existente
  async findOrCreate(discordId: string, username: string) {
    return await prisma.user.upsert({
      where: { discordId },
      update: { username, lastActive: new Date() },
      create: { discordId, username },
    });
  },

  // Adiciona pontos ao usuário
  async addPoints(discordId: string, points: number) {
    return await prisma.user.update({
      where: { discordId },
      data: { points: { increment: points } },
    });
  },

  // Atualiza streak
  async updateStreak(discordId: string, increment: boolean = true) {
    return await prisma.user.update({
      where: { discordId },
      data: { streak: increment ? { increment: 1 } : 0 },
    });
  },

  // Busca ranking
  async getRanking(limit: number = 10) {
    return await prisma.user.findMany({
      take: limit,
      orderBy: { goDevsActivitiesCount: 'desc' },
      select: {
        username: true,
        points: true,
        streak: true,
        goDevsActivitiesCount: true,
      },
    });
  },

  // Busca perfil completo com estatísticas unificadas (Discord + GoDevs)
  async getFullProfile(discordId: string) {
    const user = await prisma.user.findUnique({
      where: { discordId },
      include: {
        badges: {
          include: { badge: true },
        },
        goDevsActivities: true,
      },
    });

    if (!user) return null;
    
    return {
      ...user,
      stats: {
        totalPoints: user.points,
        streak: user.streak,
        goDevsActivities: user.goDevsActivitiesCount,
        badges: user.badges,
        lastSynced: user.lastSyncedAt,
      },
    };
  },

  // Atualiza contagem de atividades GoDevs
  async updateGoDevsCount(discordId: string, count: number) {
    return await prisma.user.update({
      where: { discordId },
      data: {
        goDevsActivitiesCount: count,
        lastSyncedAt: new Date(),
      },
    });
  },

  // Busca ranking com estatísticas completas
  async getFullRanking(limit: number = 10) {
    return await prisma.user.findMany({
      take: limit,
      orderBy: { goDevsActivitiesCount: 'desc' },
      select: {
        discordId: true,
        username: true,
        points: true,
        streak: true,
        goDevsActivitiesCount: true,
      },
    });
  },
};

// Funções auxiliares para Badges
export const badgeService = {
  // Verifica e atribui badges baseado em atividades do GoDevs
  // Recebe o count diretamente para garantir valor atualizado
  async checkAndAward(userId: string, activitiesCount?: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: true,
      },
    });

    if (!user) {
      console.log(`❌ [Badge] Usuário ${userId} não encontrado`);
      return [];
    }

    // Usa o count passado ou o do banco
    const count = activitiesCount ?? user.goDevsActivitiesCount;
    console.log(`🏆 [Badge] Verificando badges para ${user.username} (${count} atividades)`);

    const newBadges: any[] = [];

    // Badges por participação (quantidade de atividades)
    const participationBadges = [
      { name: 'Iniciante', requirement: 1 },
      { name: 'Dedicado', requirement: 5 },
      { name: 'Expert', requirement: 10 },
      { name: 'Mestre', requirement: 15 },
      { name: 'Veterano', requirement: 25 },
      { name: 'Lenda', requirement: 50 },
    ];

    // Busca todas as badges do banco de uma vez
    const allBadges = await prisma.badge.findMany();
    console.log(`🏆 [Badge] ${allBadges.length} badges encontradas no banco`);

    for (const badgeConfig of participationBadges) {
      const badgeInDb = allBadges.find(b => b.name === badgeConfig.name);

      if (!badgeInDb) {
        console.log(`⚠️ [Badge] Badge "${badgeConfig.name}" não encontrada no banco`);
        continue;
      }

      const userHasBadge = user.badges.some(ub => ub.badgeId === badgeInDb.id);

      if (!userHasBadge && count >= badgeConfig.requirement) {
        try {
          await prisma.userBadge.create({
            data: {
              userId: user.id,
              badgeId: badgeInDb.id,
            },
          });
          newBadges.push(badgeInDb);
          console.log(`✅ [Badge] Badge "${badgeInDb.name}" atribuída a ${user.username}!`);
        } catch (error: any) {
          // Ignora erro de duplicação (já tem a badge)
          if (!error.message?.includes('Unique constraint')) {
            console.error(`❌ [Badge] Erro ao atribuir badge:`, error.message);
          }
        }
      }
    }

    console.log(`🏆 [Badge] ${newBadges.length} novas badges conquistadas`);
    return newBadges;
  },

  // Cria as badges padrão se não existirem
  async ensureBadgesExist() {
    const badges = [
      { name: 'Iniciante', description: 'Entregue sua primeira atividade no GoDevs', icon: '🔥', requirement: 1, type: 'PARTICIPATION' as const },
      { name: 'Dedicado', description: 'Entregue 5 atividades no GoDevs', icon: '⚡', requirement: 5, type: 'PARTICIPATION' as const },
      { name: 'Expert', description: 'Entregue 10 atividades no GoDevs', icon: '🌟', requirement: 10, type: 'PARTICIPATION' as const },
      { name: 'Mestre', description: 'Entregue 15 atividades no GoDevs', icon: '👑', requirement: 15, type: 'PARTICIPATION' as const },
      { name: 'Veterano', description: 'Entregue 25 atividades no GoDevs', icon: '🎖️', requirement: 25, type: 'PARTICIPATION' as const },
      { name: 'Lenda', description: 'Entregue 50 atividades no GoDevs', icon: '🏆', requirement: 50, type: 'PARTICIPATION' as const },
      { name: 'Streak 7', description: '7 dias consecutivos de atividade', icon: '🎯', requirement: 7, type: 'STREAK' as const },
      { name: 'Streak 30', description: '30 dias consecutivos de atividade', icon: '💎', requirement: 30, type: 'STREAK' as const },
    ];

    let created = 0;
    for (const badge of badges) {
      const exists = await prisma.badge.findUnique({ where: { name: badge.name } });
      if (!exists) {
        await prisma.badge.create({ data: badge });
        created++;
        console.log(`🏆 [Badge] Criada: ${badge.icon} ${badge.name}`);
      }
    }
    
    if (created > 0) {
      console.log(`🏆 [Badge] ${created} badges criadas automaticamente`);
    }
    return created;
  },
};

// Funções auxiliares para atividades GoDevs (cache local)
export const goDevsActivityService = {
  // Sincroniza atividades do Supabase para o cache local
  async syncActivities(userId: string, activities: Array<{
    id: string;
    lesson_name: string;
    tipo_atividade: string;
    created_at: string;
  }>) {
    // Limpa atividades anteriores do usuário
    await prisma.goDevsActivity.deleteMany({
      where: { userId },
    });

    // Insere novas atividades
    if (activities.length > 0) {
      await prisma.goDevsActivity.createMany({
        data: activities.map(a => ({
          supabaseId: a.id,
          userId,
          activityName: a.lesson_name || 'Atividade sem nome',
          activityType: a.tipo_atividade || 'CODING',
          submittedAt: new Date(a.created_at),
        })),
        skipDuplicates: true,
      });
    }

    return activities.length;
  },

  // Busca contagem de atividades do usuário
  async getCount(userId: string) {
    return await prisma.goDevsActivity.count({
      where: { userId },
    });
  },

  // Limpa cache de atividades de um usuário
  async clearForUser(userId: string) {
    return await prisma.goDevsActivity.deleteMany({
      where: { userId },
    });
  },

  // Lista atividades de um usuário
  async getForUser(userId: string) {
    return await prisma.goDevsActivity.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });
  },
};

// Funções auxiliares para postagens diárias (histórico de desafios enviados)
export const dailyPostService = {
  // Registra postagem diária
  async recordDailyPost(challengeId: number, channelId: string, messageId: string) {
    return await prisma.dailyPost.create({
      data: {
        challengeId,
        channelId,
        messageId,
      },
    });
  },

  // Busca todos os IDs de desafios já postados
  async getAllPostedChallengeIds(): Promise<number[]> {
    const postedPosts = await prisma.dailyPost.findMany({
      select: {
        challengeId: true,
      },
      distinct: ['challengeId'],
    });
    return postedPosts.map(post => post.challengeId);
  },

  // Verifica se um desafio já foi postado
  async isChallengePosted(challengeId: number): Promise<boolean> {
    const count = await prisma.dailyPost.count({
      where: {
        challengeId,
      },
    });
    return count > 0;
  },

  // Limpa histórico de postagens
  async clearAllPosts() {
    return await prisma.dailyPost.deleteMany({});
  },

  // Busca IDs de desafios não postados (baseado no array local)
  async getUnpostedIds(totalChallenges: number): Promise<number[]> {
    const postedIds = await this.getAllPostedChallengeIds();
    const postedSet = new Set(postedIds);
    
    // Retorna IDs de 1 até totalChallenges que ainda não foram postados
    const unposted: number[] = [];
    for (let id = 1; id <= totalChallenges; id++) {
      if (!postedSet.has(id)) {
        unposted.push(id);
      }
    }
    return unposted;
  },
};

export default prisma;
