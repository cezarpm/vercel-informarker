-- CreateTable
CREATE TABLE `Chapas` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `nome_presidente` VARCHAR(191) NOT NULL,
    `data_formacao` DATETIME(3) NOT NULL,
    `pessoas_compoe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
