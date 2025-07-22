-- CreateTable
CREATE TABLE "SolPublickey" (
    "userId" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,

    CONSTRAINT "SolPublickey_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AkashPublicKey" (
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,

    CONSTRAINT "AkashPublicKey_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "SolPublickey" ADD CONSTRAINT "SolPublickey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AkashPublicKey" ADD CONSTRAINT "AkashPublicKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
