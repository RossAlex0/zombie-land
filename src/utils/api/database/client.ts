import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../prisma/generated/client';

// On réexporte tous les modèles pour faciliter leur utilisatation dans le reste de l'application
export * from '../../../../prisma/generated/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
