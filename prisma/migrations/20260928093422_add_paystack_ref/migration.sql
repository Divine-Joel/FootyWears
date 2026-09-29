/*
  Warnings:

  - A unique constraint covering the columns `[paystackRef]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paystackRef" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paystackRef_key" ON "Order"("paystackRef");
