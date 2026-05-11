-- CreateTable
CREATE TABLE "Archive" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "semester" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "img" TEXT NOT NULL DEFAULT '',
    "participants" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "recipes" TEXT NOT NULL DEFAULT '[]',
    "content" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magazine" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "readTime" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "img" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "magazineType" TEXT NOT NULL DEFAULT '',
    "instagramUrls" TEXT NOT NULL DEFAULT '[]',
    "content" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sns" TEXT NOT NULL DEFAULT '',
    "mtAvailable" TEXT NOT NULL DEFAULT '',
    "mainContact" TEXT NOT NULL DEFAULT '',
    "availableTimes" TEXT NOT NULL DEFAULT '[]',
    "interviewTimes" TEXT NOT NULL DEFAULT '[]',
    "scaleGourmet" INTEGER NOT NULL DEFAULT 0,
    "scalePeople" INTEGER NOT NULL DEFAULT 0,
    "q3_1_style" TEXT NOT NULL DEFAULT '',
    "q1_intro" TEXT NOT NULL DEFAULT '',
    "q2_drink" TEXT NOT NULL DEFAULT '',
    "q3_2_reason" TEXT NOT NULL DEFAULT '',
    "qEtc" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "endDate" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "archiveId" INTEGER,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mtDate" TEXT NOT NULL DEFAULT '',
    "interviewDates" TEXT NOT NULL DEFAULT '[]',
    "interviewTimes" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "InterviewSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplyPeriod" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "start" TEXT NOT NULL DEFAULT '',
    "end" TEXT NOT NULL DEFAULT '',
    "forceClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApplyPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminToken" (
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "AdminToken_expiresAt_idx" ON "AdminToken"("expiresAt");
