import * as z from 'zod';

export const activityCreateSchema = z.object({
  name: z.string().max(100),
  description: z.string().optional(),
  status: z.string().max(255).default('active'),
  picture: z.url().max(255).optional(),
  category_activity: z
    .array(
      z.object({
        category_id: z.number().int().positive(),
      })
    )
    .optional(),
});

// model activity {
//   id                Int                 @id @default(autoincrement())
//   name              String              @db.VarChar(100)
//   description       String?
//   picture           String?             @db.VarChar(255)
//   status            String              @default("active") @db.VarChar(50)
//   category_activity category_activity[]
// }

// model category_activity {
//   activity_id Int
//   category_id Int....
