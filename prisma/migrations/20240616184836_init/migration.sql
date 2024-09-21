/*
  Warnings:

  - You are about to drop the column `issueNumber` on the `Comic` table. All the data in the column will be lost.
  - Added the required column `comicUrl` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverDate` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_number` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeId` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeName` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeUrl` to the `Comic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "issue_number" TEXT NOT NULL,
    "coverDate" TEXT NOT NULL,
    "volumeName" TEXT NOT NULL,
    "volumeId" INTEGER NOT NULL,
    "volumeUrl" TEXT NOT NULL,
    "comicUrl" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Comic" ("createdAt", "id", "publisher", "title", "updatedAt") SELECT "createdAt", "id", "publisher", "title", "updatedAt" FROM "Comic";
DROP TABLE "Comic";
ALTER TABLE "new_Comic" RENAME TO "Comic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
