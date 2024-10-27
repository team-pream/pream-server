/*
  Warnings:

  - Made the column `condition` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "condition" SET NOT NULL;
