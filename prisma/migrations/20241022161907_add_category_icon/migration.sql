/*
  Warnings:

  - You are about to drop the column `types` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `icon` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petType` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "types",
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "petType" "PetType"[];

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "type",
ADD COLUMN     "petType" "PetType" NOT NULL;
