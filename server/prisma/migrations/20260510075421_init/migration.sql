-- CreateTable
CREATE TABLE "Archive" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Magazine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "qEtc" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "endDate" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "archiveId" INTEGER
);

-- CreateTable
CREATE TABLE "InterviewSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "mtDate" TEXT NOT NULL DEFAULT '',
    "interviewDates" TEXT NOT NULL DEFAULT '[]',
    "interviewTimes" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "ApplyPeriod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "start" TEXT NOT NULL DEFAULT '',
    "end" TEXT NOT NULL DEFAULT '',
    "forceClosed" BOOLEAN NOT NULL DEFAULT false
);
