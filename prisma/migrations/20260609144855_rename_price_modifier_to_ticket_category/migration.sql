/*
  Warnings:

  - You are about to drop the `price_modifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_price_modifier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ticket_price_modifier" DROP CONSTRAINT "fk_tpm_price_modifier";

-- DropForeignKey
ALTER TABLE "ticket_price_modifier" DROP CONSTRAINT "fk_tpm_ticket";

-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "price_modifier";

-- DropTable
DROP TABLE "ticket_price_modifier";

-- CreateTable
CREATE TABLE "ticket_category" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "reduction" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticket_category_label_key" ON "ticket_category"("label");

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_ticket_category" FOREIGN KEY ("category_id") REFERENCES "ticket_category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
