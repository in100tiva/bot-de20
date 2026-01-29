import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados antigos...');
  await prisma.userBadge.deleteMany();
  await prisma.goDevsActivity.deleteMany();
  await prisma.dailyPost.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  // Criar badges
  console.log('🏆 Criando badges...');
  const badges = [
    // ========== PARTICIPATION (8 badges) ==========
    {
      name: 'Iniciante',
      description: 'Entregue sua primeira atividade no GoDevs',
      icon: '🔥',
      requirement: 1,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Dedicado',
      description: 'Entregue 5 atividades no GoDevs',
      icon: '⚡',
      requirement: 5,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Expert',
      description: 'Entregue 10 atividades no GoDevs',
      icon: '🌟',
      requirement: 10,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Mestre',
      description: 'Entregue 15 atividades no GoDevs',
      icon: '👑',
      requirement: 15,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Veterano',
      description: 'Entregue 25 atividades no GoDevs',
      icon: '🎖️',
      requirement: 25,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Lenda',
      description: 'Entregue 50 atividades no GoDevs',
      icon: '🏆',
      requirement: 50,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Centurião',
      description: 'Entregue 100 atividades no GoDevs',
      icon: '💯',
      requirement: 100,
      type: 'PARTICIPATION' as const,
    },
    {
      name: 'Imparável',
      description: 'Entregue 200 atividades no GoDevs',
      icon: '🚀',
      requirement: 200,
      type: 'PARTICIPATION' as const,
    },
    // ========== STREAK (6 badges) ==========
    {
      name: 'Streak 3',
      description: '3 dias consecutivos de atividade',
      icon: '🔥',
      requirement: 3,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 7',
      description: '7 dias consecutivos de atividade',
      icon: '🎯',
      requirement: 7,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 14',
      description: '14 dias consecutivos de atividade',
      icon: '⚡',
      requirement: 14,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 30',
      description: '30 dias consecutivos de atividade',
      icon: '💎',
      requirement: 30,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 60',
      description: '60 dias consecutivos de atividade',
      icon: '💪',
      requirement: 60,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 100',
      description: '100 dias consecutivos de atividade',
      icon: '🌟',
      requirement: 100,
      type: 'STREAK' as const,
    },
    // ========== SPECIAL (7 badges) - Temáticas JavaScript ==========
    {
      name: 'Error Handler',
      description: 'Complete um desafio com try/catch (IDs: 16 ou 26)',
      icon: '🛡️',
      requirement: 1,
      type: 'SPECIAL' as const,
    },
    {
      name: 'API Explorer',
      description: 'Complete um desafio com consumo de API (IDs: 21, 22, 26 ou 27)',
      icon: '🌐',
      requirement: 1,
      type: 'SPECIAL' as const,
    },
    {
      name: 'Array Master',
      description: 'Complete um desafio com map/filter/reduce (IDs: 23, 24 ou 28)',
      icon: '📊',
      requirement: 1,
      type: 'SPECIAL' as const,
    },
    {
      name: 'Async Ninja',
      description: 'Complete um desafio com async/await ou Promises (IDs: 26 ou 27)',
      icon: '⚡',
      requirement: 1,
      type: 'SPECIAL' as const,
    },
    {
      name: 'OOP Architect',
      description: 'Complete o desafio de Classes ES6 (ID: 30)',
      icon: '🏗️',
      requirement: 1,
      type: 'SPECIAL' as const,
    },
    {
      name: 'DOM Wizard',
      description: 'Complete 5 desafios da categoria DOM (IDs: 1-15)',
      icon: '🎨',
      requirement: 5,
      type: 'SPECIAL' as const,
    },
    {
      name: 'JS Specialist',
      description: 'Complete 5 desafios da categoria JavaScript (IDs: 16-30)',
      icon: '🧠',
      requirement: 5,
      type: 'SPECIAL' as const,
    },
    // ========== ACHIEVEMENT (8 badges) ==========
    {
      name: 'First Blood',
      description: 'Complete seu primeiro desafio do D20',
      icon: '🩸',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Halfway There',
      description: 'Complete 15 desafios diferentes do D20',
      icon: '🎯',
      requirement: 15,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Completionist',
      description: 'Complete todos os 30 desafios do D20',
      icon: '🏆',
      requirement: 30,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Top 3 Semanal',
      description: 'Fique no Top 3 do ranking semanal',
      icon: '🥇',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Madrugador',
      description: 'Entregue um desafio antes das 8h da manhã',
      icon: '🌅',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Night Owl',
      description: 'Entregue um desafio após as 23h',
      icon: '🦉',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Speed Runner',
      description: 'Entregue um desafio em menos de 1h após ser postado',
      icon: '⏱️',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
    {
      name: 'Mentor',
      description: 'Ajude outros membros da comunidade (atribuição manual)',
      icon: '🎓',
      requirement: 1,
      type: 'ACHIEVEMENT' as const,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
    console.log(`   ✅ Badge: ${badge.icon} ${badge.name}`);
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Total: ${badges.length} badges criadas`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
