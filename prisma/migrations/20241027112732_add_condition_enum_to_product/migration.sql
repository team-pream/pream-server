-- CreateEnum
CREATE TYPE "ProductConditionType" AS ENUM ('NEW', 'SLIGHTLY_USED', 'HEAVILY_USED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "condition" "ProductConditionType";
