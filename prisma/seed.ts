import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import { PrismaClient } from './generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function generateRef() {
  return `ZBL-2026-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

/** Date à minuit UTC, décalée de `offsetDays` par rapport à aujourd'hui. */
function dayUTC(offsetDays: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d;
}

/** Instant (avec heure) il y a `daysAgo` jours — sert au created_at commercial. */
function instantDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

type Cat = { id: number; reduction: number };
type Line = { cat: Cat; quantity: number };

async function main() {
  console.log('▶ Nettoyage (RESTART IDENTITY)...');
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE refresh_token, ticket, booking, "user", category_activity, activity, category RESTART IDENTITY CASCADE;'
  );

  // Référentiels (idempotents) ------------------------------------------------
  console.log('▶ Référentiels (rôles / catégories / configuration)...');
  for (const role of [
    { id: 1, name: 'customer' },
    { id: 2, name: 'admin' },
  ]) {
    await prisma.role.upsert({ where: { id: role.id }, update: role, create: role });
  }

  const categoriesData = [
    { label: 'Adulte', reduction: 0, is_default: true, display_order: 1 },
    { label: 'Enfant', reduction: 50, is_default: false, display_order: 2 },
    { label: 'Étudiant', reduction: 30, is_default: false, display_order: 3 },
    { label: 'Sénior', reduction: 30, is_default: false, display_order: 4 },
  ];
  for (const c of categoriesData) {
    await prisma.ticket_category.upsert({ where: { label: c.label }, update: c, create: c });
  }
  const categories = await prisma.ticket_category.findMany({ orderBy: { display_order: 'asc' } });
  const [adulte, enfant, etudiant, senior] = categories;

  await prisma.configuration.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      entry_price: 25.0,
      capacity: 500,
      status: 'active',
      opening_hours: new Date('1970-01-01T09:00:00Z'),
      closing_hours: new Date('1970-01-01T19:00:00Z'),
    },
  });
  const config = await prisma.configuration.findFirstOrThrow();
  const entryPrice = Number(config.entry_price);

  // Catégories d'activités + activités ---------------------------------------
  console.log('▶ Catégories & activités...');
  const categoryLabels = [
    'Frisson',
    'Famille',
    'Sensations fortes',
    'Énigme & Réflexion',
    'Aquatique',
  ];
  const categoryByLabel = new Map<string, number>();
  for (const label of categoryLabels) {
    const c = await prisma.category.create({ data: { label } });
    categoryByLabel.set(label, c.id);
  }

  const activitiesData: {
    name: string;
    description: string;
    status: string;
    categories: string[];
  }[] = [
    { name: 'Manoir Hanté', description: 'Une demeure abandonnée envahie par les morts-vivants. Saurez-vous en ressortir ?', status: 'open', categories: ['Frisson', 'Sensations fortes'] },
    { name: 'Labyrinthe des Zombies', description: 'Un dédale plongé dans le noir où rôdent les infectés. Trouvez la sortie avant eux.', status: 'open', categories: ['Énigme & Réflexion', 'Frisson'] },
    { name: 'Survival Run', description: 'Un parcours du combattant chronométré à travers la zone de quarantaine.', status: 'open', categories: ['Sensations fortes'] },
    { name: 'Train Fantôme', description: 'Embarquez pour un voyage cauchemardesque au cœur de la contamination.', status: 'open', categories: ['Famille', 'Frisson'] },
    { name: 'Apocalypse Laser Game', description: 'Affrontez des hordes de zombies en équipe, fusil laser à la main.', status: 'open', categories: ['Famille', 'Sensations fortes'] },
    { name: 'Escape Room : Patient Zéro', description: 'Une heure pour trouver le remède avant que l’épidémie ne se propage.', status: 'open', categories: ['Énigme & Réflexion'] },
    { name: 'Rivière Maudite', description: 'Une descente en bouée sur des eaux infestées. Rénovation en cours.', status: 'close', categories: ['Aquatique', 'Famille'] },
    { name: 'Cinéma 4D Horreur', description: 'Une expérience immersive avec effets sensoriels pour toute la famille.', status: 'open', categories: ['Famille'] },
  ];

  for (const a of activitiesData) {
    const activity = await prisma.activity.create({
      data: {
        name: a.name,
        description: a.description,
        status: a.status,
        category_activity: {
          create: a.categories.map((label) => ({ category_id: categoryByLabel.get(label)! })),
        },
      },
    });
    console.log(`  ✓ #${activity.id} ${activity.name} (${a.status}) — ${a.categories.join(', ')}`);
  }

  // Utilisateurs (admin = id 1) ----------------------------------------------
  console.log('▶ Utilisateurs...');
  const passwordHash = await argon2.hash('Zombie2026!');
  const usersData = [
    { first_name: 'Sarah', last_name: 'Connor', email: 'admin@zombieland.fr', role_id: 2 },
    { first_name: 'Rick', last_name: 'Grimes', email: 'rick@example.com', role_id: 1 },
    { first_name: 'Michonne', last_name: 'Hawthorne', email: 'michonne@example.com', role_id: 1 },
    { first_name: 'Daryl', last_name: 'Dixon', email: 'daryl@example.com', role_id: 1 },
    { first_name: 'Maggie', last_name: 'Greene', email: 'maggie@example.com', role_id: 1 },
    { first_name: 'Glenn', last_name: 'Rhee', email: 'glenn@example.com', role_id: 1 },
    { first_name: 'Carol', last_name: 'Peletier', email: 'carol@example.com', role_id: 1 },
  ];
  const users = [];
  for (const u of usersData) {
    const created = await prisma.user.create({
      data: { ...u, password: passwordHash, valid_email: true },
    });
    users.push(created);
    console.log(`  ✓ #${created.id} ${created.first_name} ${created.last_name} (${u.role_id === 2 ? 'admin' : 'customer'})`);
  }
  const customers = users.filter((u) => u.role_id === 1);

  // Réservations --------------------------------------------------------------
  console.log('▶ Réservations...');

  type Spec = {
    userId: number;
    createdDaysAgo: number; // pilote les stats commerciales (created_at)
    startOffset: number; // jour de visite relatif à aujourd'hui (validity_date)
    duration: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    lines: Line[];
  };

  // Étalé sur les 30 derniers jours pour remplir today / last-week / last-month,
  // visites passées ET futures pour alimenter les deux graphes d'occupation.
  const specs: Spec[] = [
    // Aujourd'hui
    { userId: customers[0].id, createdDaysAgo: 0, startOffset: 3, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 2 }, { cat: enfant, quantity: 2 }] },
    { userId: customers[1].id, createdDaysAgo: 0, startOffset: 0, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 4 }] },
    { userId: customers[2].id, createdDaysAgo: 0, startOffset: 10, duration: 2, status: 'pending', lines: [{ cat: adulte, quantity: 2 }, { cat: senior, quantity: 2 }] },
    // Cette semaine
    { userId: customers[3].id, createdDaysAgo: 2, startOffset: -1, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 3 }, { cat: etudiant, quantity: 2 }] },
    { userId: customers[4].id, createdDaysAgo: 3, startOffset: 5, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 2 }, { cat: enfant, quantity: 3 }] },
    { userId: customers[0].id, createdDaysAgo: 5, startOffset: -3, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 1 }, { cat: senior, quantity: 1 }] },
    { userId: customers[5].id, createdDaysAgo: 6, startOffset: 2, duration: 3, status: 'confirmed', lines: [{ cat: adulte, quantity: 2 }] },
    // Ce mois
    { userId: customers[1].id, createdDaysAgo: 9, startOffset: 14, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 6 }, { cat: enfant, quantity: 4 }] },
    { userId: customers[2].id, createdDaysAgo: 12, startOffset: -8, duration: 2, status: 'confirmed', lines: [{ cat: adulte, quantity: 2 }, { cat: etudiant, quantity: 2 }] },
    { userId: customers[3].id, createdDaysAgo: 14, startOffset: 20, duration: 1, status: 'cancelled', lines: [{ cat: adulte, quantity: 3 }] },
    { userId: customers[4].id, createdDaysAgo: 18, startOffset: -12, duration: 1, status: 'confirmed', lines: [{ cat: adulte, quantity: 4 }, { cat: senior, quantity: 1 }] },
    { userId: customers[5].id, createdDaysAgo: 21, startOffset: 8, duration: 2, status: 'confirmed', lines: [{ cat: adulte, quantity: 2 }, { cat: enfant, quantity: 2 }] },
    { userId: customers[0].id, createdDaysAgo: 24, startOffset: -18, duration: 1, status: 'confirmed', lines: [{ cat: etudiant, quantity: 4 }] },
    { userId: customers[1].id, createdDaysAgo: 27, startOffset: 25, duration: 1, status: 'pending', lines: [{ cat: adulte, quantity: 2 }, { cat: enfant, quantity: 1 }] },
    { userId: customers[2].id, createdDaysAgo: 29, startOffset: -22, duration: 3, status: 'confirmed', lines: [{ cat: adulte, quantity: 3 }, { cat: senior, quantity: 2 }] },
  ];

  let count = 0;
  for (const spec of specs) {
    const reference = generateRef();
    const start = dayUTC(spec.startOffset);
    const end = dayUTC(spec.startOffset + spec.duration - 1);
    const days = Array.from({ length: spec.duration }, (_, i) => dayUTC(spec.startOffset + i));
    const ticketStatus =
      spec.status === 'cancelled' ? 'cancelled' : spec.status === 'pending' ? 'pending' : 'valid';

    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, '');
      let seq = 0;
      return spec.lines.flatMap(({ cat, quantity }) => {
        const unit_price = round2(entryPrice * (1 - cat.reduction / 100));
        return Array.from({ length: quantity }, () => {
          seq += 1;
          return {
            reservation_number: `${reference}-${dayCode}-${seq}`,
            unit_price,
            status: ticketStatus,
            validity_date: day,
            category_id: cat.id,
          };
        });
      });
    });

    const subtotal = round2(ticketData.reduce((sum, t) => sum + t.unit_price, 0));
    const total_paid = spec.status === 'cancelled' ? 0 : subtotal;
    const createdAt = instantDaysAgo(spec.createdDaysAgo);

    const booking = await prisma.booking.create({
      data: {
        reference,
        status: spec.status,
        start_at: start,
        end_at: end,
        duration: spec.duration,
        user_id: spec.userId,
        subtotal,
        discount: 0,
        total_paid,
        created_at: createdAt,
        updated_at: createdAt,
        ticket: { create: ticketData },
      },
    });
    count += 1;
    console.log(`  ✓ ${booking.reference} (${spec.status}) — ${ticketData.length} tickets — ${total_paid.toFixed(2)} €`);
  }

  console.log(`\n✅ Seed terminé : ${users.length} users, ${count} réservations.`);
  console.log('   Login admin : admin@zombieland.fr / Zombie2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
