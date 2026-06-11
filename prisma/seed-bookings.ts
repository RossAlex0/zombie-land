import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function generateRef() {
  return `ZBL-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("Aucun utilisateur trouvé. Créez un compte d'abord.");

  const categories = await prisma.ticket_category.findMany({ orderBy: { display_order: 'asc' } });
  if (categories.length === 0)
    throw new Error('Aucune catégorie de ticket. Lancez seed-categories.ts d\'abord.');

  const config = await prisma.configuration.findFirst();
  const entryPrice = config ? Number(config.entry_price) : 15;

  const scenarios = [
    {
      status: 'pending' as const,
      start_at: new Date('2026-07-15'),
      end_at: new Date('2026-07-15'),
      duration: 1,
      lines: [
        { category: categories[0], quantity: 2 },
        { category: categories[1], quantity: 1 },
      ],
    },
    {
      status: 'valid' as const,
      start_at: new Date('2026-08-01'),
      end_at: new Date('2026-08-02'),
      duration: 2,
      lines: [
        { category: categories[0], quantity: 1 },
        { category: categories[2], quantity: 1 },
      ],
    },
    {
      status: 'cancelled' as const,
      start_at: new Date('2026-06-20'),
      end_at: new Date('2026-06-20'),
      duration: 1,
      lines: [
        { category: categories[0], quantity: 3 },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const reference = generateRef();

    const days = Array.from({ length: scenario.duration }, (_, i) => {
      const d = new Date(scenario.start_at);
      d.setUTCDate(d.getUTCDate() + i);
      return d;
    });

    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, '');
      let seq = 0;
      return scenario.lines.flatMap(({ category, quantity }) => {
        const unitPrice = round2(entryPrice * (1 - category.reduction / 100));
        return Array.from({ length: quantity }, () => {
          seq += 1;
          return {
            reservation_number: `${reference}-${dayCode}-${seq}`,
            unit_price: unitPrice,
            status: scenario.status === 'cancelled' ? 'cancelled' : scenario.status === 'valid' ? 'valid' : 'pending',
            validity_date: day,
            category_id: category.id,
          };
        });
      });
    });

    const subtotal = round2(ticketData.reduce((sum, t) => sum + t.unit_price, 0));
    const total_paid = subtotal;

    const result = await prisma.booking.create({
      data: {
        reference,
        status: scenario.status,
        start_at: scenario.start_at,
        end_at: scenario.end_at,
        duration: scenario.duration,
        user_id: user.id,
        subtotal,
        discount: 0,
        total_paid,
        ticket: { create: ticketData },
      },
    });

    console.log(
      `  ✓ ${result.reference} (${result.status}) — ${ticketData.length} tickets — ${total_paid.toFixed(2)} €`
    );
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
