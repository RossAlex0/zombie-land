-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "fk_booking_user";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- CreateIndex
CREATE INDEX "user_deleted_at_idx" ON "user"("deleted_at");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "fk_booking_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
