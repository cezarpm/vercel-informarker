/*
  Warnings:

  - Added the required column `carta_indicacao_2_membros` to the `Associados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comprovante_cpf` to the `Associados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_inicio_especializacao` to the `Associados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_nascimento` to the `Associados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_previsao_conclusao` to the `Associados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Associados` ADD COLUMN `carta_indicacao_2_membros` VARCHAR(191) NOT NULL,
    ADD COLUMN `comprovante_cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `data_inicio_especializacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `data_nascimento` VARCHAR(191) NOT NULL,
    ADD COLUMN `data_previsao_conclusao` VARCHAR(191) NOT NULL;
