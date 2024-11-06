/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,status,paymentStatus]` on the table `TempOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentStatus` to the `TempOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `TempOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `TempOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TempOrder" DROP CONSTRAINT "TempOrder_productId_fkey";

-- DropIndex
DROP INDEX "TempOrder_productId_idx";

-- DropIndex
DROP INDEX "TempOrder_userId_idx";

-- AlterTable
ALTER TABLE "TempOrder" ADD COLUMN     "paymentStatus" "PaymentStatusType" NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT,
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "status" "OrderStatusType" NOT NULL;

-- CreateIndex
CREATE INDEX "TempOrder_userId_productId_idx" ON "TempOrder"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "TempOrder_userId_productId_status_paymentStatus_key" ON "TempOrder"("userId", "productId", "status", "paymentStatus");

-- AddForeignKey
ALTER TABLE "TempOrder" ADD CONSTRAINT "TempOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
