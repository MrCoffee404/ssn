-- AlterTable
ALTER TABLE "Username" ADD COLUMN     "joinCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "playedSeconds" INTEGER NOT NULL DEFAULT 0;
