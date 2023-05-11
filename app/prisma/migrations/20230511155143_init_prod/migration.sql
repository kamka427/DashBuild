-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_in" INTEGER,
    "ext_expires_in" INTEGER,
    "refresh_token_expires_in" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "thumbnailPath" TEXT NOT NULL,
    "grafanaJSON" JSONB NOT NULL,
    "grafanaUrl" TEXT,
    "columns" INTEGER NOT NULL DEFAULT 2,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardIteration" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "grafanaJSON" JSONB NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DashboardIteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailPath" TEXT NOT NULL,
    "grafanaJSON" JSONB NOT NULL,
    "grafanaUrl" TEXT,
    "width" INTEGER NOT NULL DEFAULT 1,
    "position" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Panel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardIteration" ADD CONSTRAINT "DashboardIteration_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panel" ADD CONSTRAINT "Panel_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
