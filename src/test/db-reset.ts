import { beforeEach } from 'vitest';
import { prisma } from '../utils/api/database/client';

//isolation of integration tests: all files share the same database.
// We empty the volatile tables BEFORE each test files.
// We do NOT touch `role` or `configuration`: they are
// seeded once per file in a beforeAll and must survive between tests.
beforeEach(async () => {
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.refresh_token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ticket_category.deleteMany();
});
