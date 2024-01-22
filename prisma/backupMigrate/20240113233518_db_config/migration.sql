/*
  Warnings:

  - You are about to drop the column `data_formacao` on the `chapas` table. All the data in the column will be lost.
  - You are about to drop the column `nome_presidente` on the `chapas` table. All the data in the column will be lost.
  - You are about to drop the column `pessoas_compoe` on the `chapas` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_chapa` on the `chapas` table. All the data in the column will be lost.
  - Added the required column `membros_chapa` to the `Chapas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_chapa` to the `Chapas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chapas` DROP COLUMN `data_formacao`,
    DROP COLUMN `nome_presidente`,
    DROP COLUMN `pessoas_compoe`,
    DROP COLUMN `titulo_chapa`,
    ADD COLUMN `membros_chapa` JSON NOT NULL,
    ADD COLUMN `nome_chapa` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Protocolos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_protocolo` VARCHAR(191) NULL,
    `assunto_protocolo` VARCHAR(191) NULL,
    `tipo_protocolo` VARCHAR(191) NULL,
    `remetente` VARCHAR(191) NULL,
    `destinatario` VARCHAR(191) NULL,
    `data_recebimento_dia` INTEGER NULL,
    `data_recebimento_mes` INTEGER NULL,
    `data_recebimento_ano` INTEGER NULL,
    `data_envio_dia` INTEGER NULL,
    `data_envio_mes` INTEGER NULL,
    `data_envio_ano` INTEGER NULL,
    `meio_recebimento` VARCHAR(191) NULL,
    `meio_envio` VARCHAR(191) NULL,
    `quem_redigiu_documento_a_ser_enviado` VARCHAR(191) NULL,
    `entregue_em_maos` BOOLEAN NULL,
    `doc_entrada_requer_resposta` BOOLEAN NULL,
    `anexos` VARCHAR(191) NULL,
    `data_encerramento_protocolo_dia` INTEGER NULL,
    `data_encerramento_protocolo_mes` INTEGER NULL,
    `data_encerramento_protocolo_ano` INTEGER NULL,
    `usuario_encerramento_protocolo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Votacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` VARCHAR(191) NOT NULL,
    `data_votacao_inicio` VARCHAR(191) NOT NULL,
    `data_votacao_fim` VARCHAR(191) NOT NULL,
    `chapas` JSON NOT NULL,
    `status` ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_chapa` VARCHAR(191) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `votacao_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
