/*
  Warnings:

  - You are about to drop the column `carta_indicacao_2_mrmbros` on the `Associados` table. All the data in the column will be lost.
  - You are about to drop the column `dayPrevisaoConclusao` on the `Associados` table. All the data in the column will be lost.
  - You are about to drop the column `monthPrevisaoConclusao` on the `Associados` table. All the data in the column will be lost.
  - You are about to drop the column `yearPrevisaoConclusao` on the `Associados` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Associados` DROP COLUMN `carta_indicacao_2_mrmbros`,
    DROP COLUMN `dayPrevisaoConclusao`,
    DROP COLUMN `monthPrevisaoConclusao`,
    DROP COLUMN `yearPrevisaoConclusao`;
