/*
  Warnings:

  - Added the required column `discount` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_paid` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "discount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "promo_code" TEXT,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_paid" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;
