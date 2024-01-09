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
