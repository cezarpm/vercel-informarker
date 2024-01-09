-- CreateTable
CREATE TABLE `Adicionais_SAERJ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` VARCHAR(191) NOT NULL,
    `admissao_saerj` VARCHAR(191) NOT NULL,
    `categoria_saerj` VARCHAR(191) NOT NULL,
    `situacao` VARCHAR(191) NOT NULL,
    `cooperativa` VARCHAR(191) NOT NULL,
    `nome_pai` VARCHAR(191) NOT NULL,
    `nome_mae` VARCHAR(191) NOT NULL,
    `tsa` VARCHAR(191) NOT NULL,
    `observacao_1` VARCHAR(191) NOT NULL,
    `observacao_2` VARCHAR(191) NOT NULL,
    `observacao_3` VARCHAR(191) NOT NULL,
    `hospital_1` VARCHAR(191) NOT NULL,
    `hospital_2` VARCHAR(191) NOT NULL,
    `tratamento` VARCHAR(191) NOT NULL,
    `nacionalidade` VARCHAR(191) NOT NULL,
    `foto_associado` VARCHAR(191) NOT NULL,
    `cet_data_inicio` VARCHAR(191) NOT NULL,
    `cet_data_fim` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` VARCHAR(191) NOT NULL,
    `tipo_pagamento` VARCHAR(191) NOT NULL,
    `ano_anuidade` VARCHAR(191) NOT NULL,
    `data_pagto_unica` VARCHAR(191) NOT NULL,
    `valor_pagto_unica` VARCHAR(191) NOT NULL,
    `data_pagto_parcela_1` VARCHAR(191) NOT NULL,
    `valor_pagto_parcela_1` VARCHAR(191) NOT NULL,
    `data_pagto_parcela_2` VARCHAR(191) NOT NULL,
    `valor_pagto_parcela_2` VARCHAR(191) NOT NULL,
    `data_pagto_parcela_3` VARCHAR(191) NOT NULL,
    `valor_pagto_parcela_3` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
