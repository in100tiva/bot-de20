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
      orderBy: { points: 'desc' },
      select: {
        username: true,
        points: true,
        streak: true,
        _count: {
          select: { submissions: true },
        },
      },
    });
  },

  // Busca perfil com estatísticas
  async getProfile(discordId: string) {
    return await prisma.user.findUnique({
      where: { discordId },
      include: {
        submissions: {
          where: { status: 'APPROVED' },
          select: { challengeId: true, points: true },
        },
        badges: {
          include: { badge: true },
        },
      },
    });
  },
};

// Funções auxiliares para Submissões
export const submissionService = {
  // Cria nova submissão
  async create(userId: string, challengeId: number, url: string) {
    return await prisma.submission.create({
      data: {
        userId,
        challengeId,
        url,
        status: 'PENDING',
      },
      include: {
        user: true,
        challenge: true,
      },
    });
  },

  // Lista submissões pendentes
  async getPending() {
    return await prisma.submission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: true,
        challenge: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
  },

  // Aprova submissão
  async approve(id: string, points: number, feedback?: string) {
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status: 'APPROVED',
        points,
        feedback: feedback || null,
        reviewedAt: new Date(),
      },
    });

    // Busca usuário para adicionar pontos
    const user = await prisma.user.findUnique({
      where: { id: submission.userId },
    });

    if (user) {
      await userService.addPoints(user.discordId, points);
    }

    return submission;
  },

  // Rejeita submissão
  async reject(id: string, feedback: string) {
    return await prisma.submission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        feedback,
        reviewedAt: new Date(),
      },
    });
  },

  // Busca submissões de um desafio
  async getByChallengeId(challengeId: number) {
    return await prisma.submission.findMany({
      where: { 
        challengeId,
        status: 'APPROVED' 
      },
      include: { user: true },
      orderBy: { submittedAt: 'desc' },
    });
  },
};

// Funções auxiliares para Desafios
export const challengeService = {
  // Busca desafio por ID
  async getById(id: number) {
    return await prisma.challenge.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
  },

  // Lista todos os desafios
  async getAll() {
    return await prisma.challenge.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
  },

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

  // Busca desafios ainda não postados
  async getUnposted() {
    const allChallenges = await prisma.challenge.findMany({
      where: { active: true },
      select: { id: true },
    });

    const postedIds = await prisma.dailyPost.findMany({
      select: { challengeId: true },
      distinct: ['challengeId'],
    });

    const postedSet = new Set(postedIds.map(p => p.challengeId));
    return allChallenges.filter(c => !postedSet.has(c.id)).map(c => c.id);
  },
};

// Funções auxiliares para Badges
export const badgeService = {
  // Verifica e atribui badges
  async checkAndAward(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        submissions: { where: { status: 'APPROVED' } },
        badges: true,
      },
    });

    if (!user) return [];

    const newBadges = [];
    const approvedCount = user.submissions.length;

    // Badge por participação
    const participationBadges = [
      { name: 'Iniciante', requirement: 1 },
      { name: 'Dedicado', requirement: 5 },
      { name: 'Expert', requirement: 10 },
      { name: 'Mestre', requirement: 15 },
    ];

    for (const badge of participationBadges) {
      const badgeExists = await prisma.badge.findUnique({
        where: { name: badge.name },
      });

      if (!badgeExists) continue;

      const userHasBadge = user.badges.some(ub => ub.badgeId === badgeExists.id);

      if (!userHasBadge && approvedCount >= badge.requirement) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badgeExists.id,
          },
        });
        newBadges.push(badgeExists);
      }
    }

    return newBadges;
  },
};

export default prisma;

