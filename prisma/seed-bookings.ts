import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Number of bookings to generate (overridable: NB_BOOKINGS=100 npx tsx prisma/seed-bookings.ts)
const NB_BOOKINGS = Number(process.env.NB_BOOKINGS ?? 45);

// Distribution of booking statuses. Mostly paid so the pagination
// FILTERED on "Paid" also spans more than one page (> 20).
const STATUS_WEIGHTS: { status: BookingStatus; weight: number }[] = [
  { status: 'paid', weight: 0.55 },
  { status: 'pending', weight: 0.3 },
  { status: 'cancelled', weight: 0.15 },
];

type BookingStatus = 'pending' | 'paid' | 'cancelled';

function generateRef() {
  return `ZBL-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickStatus(): BookingStatus {
  const r = Math.random();
  let acc = 0;
  for (const { status, weight } of STATUS_WEIGHTS) {
    acc += weight;
    if (r <= acc) return status;
  }
  return 'pending';
}

// TICKET status derived from the booking status: paid → valid tickets, cancelled → cancelled, otherwise pending.
function ticketStatusFor(bookingStatus: BookingStatus) {
  if (bookingStatus === 'cancelled') return 'cancelled';
  if (bookingStatus === 'paid') return 'valid';
  return 'pending';
}

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("Aucun utilisateur trouvé. Créez un compte d'abord.");

  const categories = await prisma.ticket_category.findMany({ orderBy: { display_order: 'asc' } });
  if (categories.length === 0)
    throw new Error("Aucune catégorie de ticket. Lancez seed-categories.ts d'abord.");

  const config = await prisma.configuration.findFirst();
  const entryPrice = config ? Number(config.entry_price) : 15;

  const counts: Record<BookingStatus, number> = { pending: 0, paid: 0, cancelled: 0 };

  for (let i = 0; i < NB_BOOKINGS; i++) {
    const status = pickStatus();
    const duration = randomInt(1, 3);

    // Start date spread from -60 to +120 days around today (date-only, UTC).
    const start_at = new Date();
    start_at.setUTCDate(start_at.getUTCDate() + randomInt(-60, 120));
    start_at.setUTCHours(0, 0, 0, 0);

    const end_at = new Date(start_at);
    end_at.setUTCDate(end_at.getUTCDate() + (duration - 1));

    // 1 to 3 ticket lines, each on a distinct category, quantity 1 to 4.
    const nbLines = randomInt(1, Math.min(3, categories.length));
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    const lines = shuffled
      .slice(0, nbLines)
      .map((category) => ({ category, quantity: randomInt(1, 4) }));

    const reference = generateRef();

    const days = Array.from({ length: duration }, (_, d) => {
      const day = new Date(start_at);
      day.setUTCDate(day.getUTCDate() + d);
      return day;
    });

    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, '');
      let seq = 0;
      return lines.flatMap(({ category, quantity }) => {
        const unitPrice = round2(entryPrice * (1 - category.reduction / 100));
        return Array.from({ length: quantity }, () => {
          seq += 1;
          return {
            reservation_number: `${reference}-${dayCode}-${seq}`,
            unit_price: unitPrice,
            status: ticketStatusFor(status),
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
        status,
        start_at,
        end_at,
        duration,
        user_id: user.id,
        subtotal,
        discount: 0,
        total_paid,
        ticket: { create: ticketData },
      },
    });

    counts[status]++;
    console.log(
      `  ✓ ${result.reference} (${result.status}) — ${ticketData.length} tickets — ${total_paid.toFixed(2)} €`
    );
  }

  console.log(
    `\n${NB_BOOKINGS} réservations créées → paid: ${counts.paid}, pending: ${counts.pending}, cancelled: ${counts.cancelled}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
