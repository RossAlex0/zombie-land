import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { label: 'Adulte',   reduction: 0,  is_default: true,  display_order: 1 },
    { label: 'Enfant',   reduction: 50, is_default: false, display_order: 2 },
    { label: 'Étudiant', reduction: 30, is_default: false, display_order: 3 },
    { label: 'Sénior',   reduction: 30, is_default: false, display_order: 4 },
  ];

  for (const cat of categories) {
    await prisma.ticket_category.upsert({
      where: { label: cat.label },
      update: cat,
      create: cat,
    });
    console.log(`  ✓ ${cat.label} (-${cat.reduction}%)${cat.is_default ? ' [default]' : ''}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
