/*
  Warnings:

  - You are about to drop the column `createdBy` on the `meetups` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailConfirmed` on the `users` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `meetups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_email_confirmed` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "meetups" DROP COLUMN "createdBy",
ADD COLUMN     "creator_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isEmailConfirmed",
ADD COLUMN     "is_email_confirmed" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "meetups" ADD CONSTRAINT "meetups_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
