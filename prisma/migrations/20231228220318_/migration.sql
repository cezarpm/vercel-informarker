/*
  Warnings:

  - You are about to alter the column `data_nascimento` on the `Associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Associados` MODIFY `data_nascimento` DATETIME(3) NULL;
