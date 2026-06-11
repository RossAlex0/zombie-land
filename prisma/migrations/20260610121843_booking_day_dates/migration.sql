-- 1. Lever l'ancienne contrainte stricte AVANT de changer les types
--    (sinon la troncature timestamp->date viole "end_at > start_at" sur les résas d'un jour)
ALTER TABLE "booking" DROP CONSTRAINT "chk_booking_dates";

-- 2. Passer les champs "jour" en DATE
ALTER TABLE "booking" ALTER COLUMN "start_at" SET DATA TYPE DATE,
ALTER COLUMN "end_at" SET DATA TYPE DATE;

ALTER TABLE "ticket" ALTER COLUMN "validity_date" SET DATA TYPE DATE;

-- 3. Recréer la contrainte relâchée (autorise une résa d'un seul jour : end_at == start_at)
ALTER TABLE "booking" ADD CONSTRAINT "chk_booking_dates" CHECK (end_at >= start_at);
