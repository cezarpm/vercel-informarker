/*
  Warnings:

  - You are about to alter the column `data_nascimento` on the `associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `data_inicio_especializacao` on the `associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `data_previsao_conclusao` on the `associados` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to drop the column `data_encerramento_protocolo` on the `protocolos` table. All the data in the column will be lost.
  - You are about to drop the column `data_envio` on the `protocolos` table. All the data in the column will be lost.
  - You are about to drop the column `data_recebimento` on the `protocolos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `associados` MODIFY `data_nascimento` DATETIME(3) NULL,
    MODIFY `data_inicio_especializacao` DATETIME(3) NULL,
    MODIFY `data_previsao_conclusao` DATETIME(3) NULL,
    MODIFY `crm` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `protocolos` DROP COLUMN `data_encerramento_protocolo`,
    DROP COLUMN `data_envio`,
    DROP COLUMN `data_recebimento`,
    ADD COLUMN `data_encerramento_protocolo_ano` INTEGER NULL,
    ADD COLUMN `data_encerramento_protocolo_dia` INTEGER NULL,
    ADD COLUMN `data_encerramento_protocolo_mes` INTEGER NULL,
    ADD COLUMN `data_envio_ano` INTEGER NULL,
    ADD COLUMN `data_envio_dia` INTEGER NULL,
    ADD COLUMN `data_envio_mes` INTEGER NULL,
    ADD COLUMN `data_recebimento_ano` INTEGER NULL,
    ADD COLUMN `data_recebimento_dia` INTEGER NULL,
    ADD COLUMN `data_recebimento_mes` INTEGER NULL;

-- CreateTable
CREATE TABLE `Chapas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_chapa` VARCHAR(191) NOT NULL,
    `membros_chapa` JSON NOT NULL,

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

-- CreateTable
CREATE TABLE `Chapas_Eleicoes` (
    `cod_chapa` VARCHAR(191) NOT NULL,
    `numero_eleicao` INTEGER NOT NULL,
    `titulo_chapa` VARCHAR(50) NOT NULL,
    `descricao_chapa` VARCHAR(255) NULL,
    `quantidade_votos` INTEGER NULL,
    `chapa_vencedora` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`cod_chapa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diretorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_eleicao` INTEGER NOT NULL,
    `cod_chapa` VARCHAR(255) NOT NULL,
    `matricula_saerj` INTEGER NOT NULL,
    `candidato_cargo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Eleicoes` (
    `numero_eleicao` INTEGER NOT NULL,
    `titulo_eleicao` VARCHAR(255) NOT NULL,
    `votacao_inicio` DATETIME(3) NOT NULL,
    `votacao_fim` DATETIME(3) NOT NULL,
    `mandato_inicio` DATETIME(3) NOT NULL,
    `mandato_fim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`numero_eleicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_log` VARCHAR(191) NOT NULL,
    `ocorrencia_log` VARCHAR(191) NOT NULL,
    `data_hora_log` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
