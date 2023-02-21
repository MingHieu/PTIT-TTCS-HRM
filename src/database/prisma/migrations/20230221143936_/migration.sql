/*
  Warnings:

  - You are about to drop the column `content` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `preview` on the `News` table. All the data in the column will be lost.
  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Salary` table. All the data in the column will be lost.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createAt` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "status" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "content",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "preview",
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("name", "role");

-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "updateAt",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("name")
);
