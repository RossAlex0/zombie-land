-- AlterTable
ALTER TABLE "booking" ADD COLUMN "reference" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "booking_reference_key" ON "booking"("reference");
