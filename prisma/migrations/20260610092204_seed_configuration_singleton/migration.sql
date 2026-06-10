-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "status" SET DEFAULT 'open';

INSERT INTO "configuration" (
  id,
  entry_price,
  capacity,
  status,
  opening_hours,
  closing_hours,
  created_at,
  updated_at
)
VALUES (
  1,
  25.00,
  500,
  'active',
  '09:00:00',
  '19:00:00',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
