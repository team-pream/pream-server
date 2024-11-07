/*
  Warnings:

  - You are about to drop the column `title` on the `TempOrder` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `TempOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `TempOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TempOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TempOrder" DROP COLUMN "title",
ADD COLUMN     "paymentMethod" "PaymentMethodType" NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TempOrder_userId_idx" ON "TempOrder"("userId");

-- CreateIndex
CREATE INDEX "TempOrder_productId_idx" ON "TempOrder"("productId");

-- AddForeignKey
ALTER TABLE "TempOrder" ADD CONSTRAINT "TempOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempOrder" ADD CONSTRAINT "TempOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
