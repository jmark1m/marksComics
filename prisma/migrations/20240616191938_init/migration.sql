/*
  Warnings:

  - You are about to drop the column `publisher` on the `Comic` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "issue_number" TEXT NOT NULL,
    "coverDate" TEXT,
    "volumeName" TEXT,
    "volumeId" INTEGER NOT NULL,
    "volumeUrl" TEXT,
    "comicUrl" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageUrlTiny" TEXT,
    "binLocation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Comic" ("comicUrl", "coverDate", "createdAt", "description", "id", "imageUrl", "imageUrlTiny", "issue_number", "title", "updatedAt", "volumeId", "volumeName", "volumeUrl") SELECT "comicUrl", "coverDate", "createdAt", "description", "id", "imageUrl", "imageUrlTiny", "issue_number", "title", "updatedAt", "volumeId", "volumeName", "volumeUrl" FROM "Comic";
DROP TABLE "Comic";
ALTER TABLE "new_Comic" RENAME TO "Comic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
