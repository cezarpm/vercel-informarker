/*
  Warnings:

  - You are about to drop the column `nome` on the `chapas` table. All the data in the column will be lost.
  - Added the required column `titulo_chapa` to the `Chapas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chapas` DROP COLUMN `nome`,
    ADD COLUMN `titulo_chapa` VARCHAR(191) NOT NULL;
