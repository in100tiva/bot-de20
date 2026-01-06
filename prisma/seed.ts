import { PrismaClient } from '@prisma/client';
import { dailyChallenges } from '../src/utils/challenges.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados antigos...');
  await prisma.userBadge.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.dailyPost.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  // Criar desafios
  console.log('📝 Criando desafios...');
  for (const challenge of dailyChallenges) {
    // Mapear dificuldade para o enum correto
    let difficulty: 'FACIL' | 'MEDIO' | 'DIFICIL' = 'MEDIO';
    if (challenge.difficulty === 'Fácil') difficulty = 'FACIL';
    else if (challenge.difficulty === 'Médio') difficulty = 'MEDIO';
    else if (challenge.difficulty === 'Difícil') difficulty = 'DIFICIL';

    await prisma.challenge.create({
      data: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: difficulty,
        requirements: challenge.requirements,
        active: true,
      },
    });
    console.log(`   ✅ Desafio #${challenge.id}: ${challenge.title}`);
  }

  // Criar badges
  console.log('🏆 Criando badges...');
  const badges = [
    {
      name: 'Iniciante',
      description: 'Complete seu primeiro desafio',
      icon: '🔥',
      requirement: 1,
      type: 'PARTICIPATION',
    },
    {
      name: 'Dedicado',
      description: 'Complete 5 desafios',
      icon: '⚡',
      requirement: 5,
      type: 'PARTICIPATION',
    },
    {
      name: 'Expert',
      description: 'Complete 10 desafios',
      icon: '🌟',
      requirement: 10,
      type: 'PARTICIPATION',
    },
    {
      name: 'Mestre',
      description: 'Complete todos os 15 desafios',
      icon: '👑',
      requirement: 15,
      type: 'PARTICIPATION',
    },
    {
      name: 'Streak 7',
      description: '7 dias consecutivos completando desafios',
      icon: '🎯',
      requirement: 7,
      type: 'STREAK',
    },
    {
      name: 'Perfeccionista',
      description: 'Complete um desafio difícil',
      icon: '💎',
      requirement: 1,
      type: 'ACHIEVEMENT',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
    console.log(`   ✅ Badge: ${badge.icon} ${badge.name}`);
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Total: ${dailyChallenges.length} desafios e ${badges.length} badges criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


