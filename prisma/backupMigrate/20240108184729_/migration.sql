/*
  Warnings:

  - You are about to alter the column `data_inicio_especializacao` on the `Associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `data_previsao_conclusao` on the `Associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Associados` MODIFY `data_inicio_especializacao` DATETIME(3) NULL,
    MODIFY `data_previsao_conclusao` DATETIME(3) NULL;
