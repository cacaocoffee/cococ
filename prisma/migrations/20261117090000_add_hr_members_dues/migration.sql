-- 인사(회원·회비) 표를 추가한다.

-- schema.prisma에는 있는데 이전 마이그레이션에 빠져 있던 컬럼.
-- 운영 DB에 이미 있을 수 있어서, 있으면 건너뛰게 한다.
ALTER TABLE "ApplyPeriod" ADD COLUMN IF NOT EXISTS "generation" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "generation" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedMonth" TEXT NOT NULL,
    "stoppedMonth" TEXT NOT NULL DEFAULT '',
    "monthlyFee" INTEGER,
    "waivedAmount" INTEGER NOT NULL DEFAULT 0,
    "depositNames" TEXT NOT NULL DEFAULT '[]',
    "memo" TEXT NOT NULL DEFAULT '',
    "applicationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuesDeposit" (
    "id" SERIAL NOT NULL,
    "depositedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "depositorName" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'notification',
    "rawTitle" TEXT NOT NULL DEFAULT '',
    "rawBody" TEXT NOT NULL DEFAULT '',
    "dedupeKey" TEXT NOT NULL,
    "memberId" INTEGER,
    "matchedBy" TEXT NOT NULL DEFAULT '',
    "ignored" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuesDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuesReminder" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "testMode" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuesReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "clubName" TEXT NOT NULL DEFAULT '코콕',
    "monthlyFee" INTEGER NOT NULL DEFAULT 40000,
    "dueDay" INTEGER NOT NULL DEFAULT 9,
    "reminderOffsets" TEXT NOT NULL DEFAULT '[-3,0,1]',
    "sendStartHour" INTEGER NOT NULL DEFAULT 9,
    "sendEndHour" INTEGER NOT NULL DEFAULT 20,
    "accountInfo" TEXT NOT NULL DEFAULT '',
    "noticeClause" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "HrSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrDevice" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "HrDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_applicationId_key" ON "Member"("applicationId");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DuesDeposit_dedupeKey_key" ON "DuesDeposit"("dedupeKey");

-- CreateIndex
CREATE INDEX "DuesDeposit_memberId_idx" ON "DuesDeposit"("memberId");

-- CreateIndex
CREATE INDEX "DuesDeposit_depositedAt_idx" ON "DuesDeposit"("depositedAt");

-- CreateIndex
CREATE INDEX "DuesReminder_month_idx" ON "DuesReminder"("month");

-- CreateIndex
CREATE UNIQUE INDEX "DuesReminder_memberId_month_kind_key" ON "DuesReminder"("memberId", "month", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "HrDevice_tokenHash_key" ON "HrDevice"("tokenHash");

-- AddForeignKey
ALTER TABLE "DuesDeposit" ADD CONSTRAINT "DuesDeposit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuesReminder" ADD CONSTRAINT "DuesReminder_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

