/*
  Warnings:

  - You are about to drop the column `description` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "description",
DROP COLUMN "image",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "website" TEXT;
