/*
  Warnings:

  - Changed the type of `pvtKey` on the `privateKey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "privateKey" DROP COLUMN "pvtKey",
ADD COLUMN     "pvtKey" BYTEA NOT NULL;
