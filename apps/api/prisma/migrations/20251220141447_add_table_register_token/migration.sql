-- CreateTable
CREATE TABLE "RegisterToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RegisterToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterToken_token_key" ON "RegisterToken"("token");
