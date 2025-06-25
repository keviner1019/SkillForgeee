-- CreateEnum
CREATE TYPE "CollaborationRole" AS ENUM ('EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CollaborationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PLATFORM_CREDIT_PURCHASE', 'PATH_PURCHASE', 'USER_WITHDRAWAL', 'WITHDRAWAL_FEE');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "creditBalance" INTEGER NOT NULL DEFAULT 0,
    "stripeAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "NodeStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "notificationDate" TIMESTAMP(3),
    "color" TEXT,
    "positionX" DOUBLE PRECISION,
    "positionY" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "parentNodeId" INTEGER,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" SERIAL NOT NULL,
    "role" "CollaborationRole" NOT NULL,
    "userId" INTEGER NOT NULL,
    "learningPathId" INTEGER NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationRequest" (
    "id" SERIAL NOT NULL,
    "offeredRole" "CollaborationRole" NOT NULL,
    "status" "CollaborationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "learningPathId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "CollaborationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPurchasedPath" (
    "id" SERIAL NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "learningPathId" INTEGER NOT NULL,

    CONSTRAINT "UserPurchasedPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" SERIAL NOT NULL,
    "amountCredits" INTEGER NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "platformFeeMinor" INTEGER NOT NULL,
    "finalPayoutMinor" INTEGER NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "stripeTransferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");

-- CreateIndex
CREATE INDEX "LearningPath_ownerId_idx" ON "LearningPath"("ownerId");

-- CreateIndex
CREATE INDEX "Node_learningPathId_idx" ON "Node"("learningPathId");

-- CreateIndex
CREATE INDEX "Collaboration_userId_idx" ON "Collaboration"("userId");

-- CreateIndex
CREATE INDEX "Collaboration_learningPathId_idx" ON "Collaboration"("learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaboration_userId_learningPathId_key" ON "Collaboration"("userId", "learningPathId");

-- CreateIndex
CREATE INDEX "CollaborationRequest_receiverId_status_idx" ON "CollaborationRequest"("receiverId", "status");

-- CreateIndex
CREATE INDEX "Transaction_senderId_idx" ON "Transaction"("senderId");

-- CreateIndex
CREATE INDEX "Transaction_receiverId_idx" ON "Transaction"("receiverId");

-- CreateIndex
CREATE INDEX "UserPurchasedPath_userId_idx" ON "UserPurchasedPath"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPurchasedPath_userId_learningPathId_key" ON "UserPurchasedPath"("userId", "learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalRequest_stripeTransferId_key" ON "WithdrawalRequest"("stripeTransferId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_userId_idx" ON "WithdrawalRequest"("userId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_status_idx" ON "WithdrawalRequest"("status");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationRequest" ADD CONSTRAINT "CollaborationRequest_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationRequest" ADD CONSTRAINT "CollaborationRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationRequest" ADD CONSTRAINT "CollaborationRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchasedPath" ADD CONSTRAINT "UserPurchasedPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchasedPath" ADD CONSTRAINT "UserPurchasedPath_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
