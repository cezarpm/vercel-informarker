/*
  Warnings:

  - You are about to drop the column `logadouro` on the `Empresa` table. All the data in the column will be lost.
  - Added the required column `logradouro` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Empresa` DROP COLUMN `logadouro`,
    ADD COLUMN `logradouro` VARCHAR(191) NOT NULL;
