-- CreateTable
CREATE TABLE "privateKey" (
    "pubkey" TEXT NOT NULL,
    "pvtKey" TEXT NOT NULL,

    CONSTRAINT "privateKey_pkey" PRIMARY KEY ("pubkey")
);
