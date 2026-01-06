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
      name: 'Streak 7',
      description: '7 dias consecutivos de atividade',
      icon: '🎯',
      requirement: 7,
      type: 'STREAK' as const,
    },
    {
      name: 'Streak 30',
      description: '30 dias consecutivos de atividade',
      icon: '💎',
      requirement: 30,
      type: 'STREAK' as const,
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
