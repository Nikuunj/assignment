/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `AkashPublicKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pubkey]` on the table `AkashPublicKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pubkey]` on the table `SolPublickey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AkashPublicKey_address_key" ON "AkashPublicKey"("address");

-- CreateIndex
CREATE UNIQUE INDEX "AkashPublicKey_pubkey_key" ON "AkashPublicKey"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "SolPublickey_pubkey_key" ON "SolPublickey"("pubkey");
