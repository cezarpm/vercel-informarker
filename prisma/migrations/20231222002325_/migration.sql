-- CreateTable
CREATE TABLE `Categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parametros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random` VARCHAR(191) NOT NULL,
    `cep_invalido` BOOLEAN NOT NULL DEFAULT false,
    `data_limite_pgto_antecipado_anuidade` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_anuidade` DECIMAL(65, 30) NOT NULL,
    `taxa_pgto_atrasado_anuidade` DECIMAL(65, 30) NOT NULL,
    `parcelamento_permitido_anuidade` VARCHAR(191) NOT NULL,
    `data_limite_pgto_antecipado_JAER` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_JAER` DECIMAL(65, 30) NOT NULL,
    `taxa_pgto_atrasado_JAER` INTEGER NOT NULL,
    `parcelamento_permitido_JAER` VARCHAR(191) NOT NULL,
    `presidente_pode_se_reeleger` BOOLEAN NOT NULL,
    `demais_podem_se_reeleger` BOOLEAN NOT NULL,
    `duracao_mandato` INTEGER NOT NULL,
    `exite_listas_imediato` BOOLEAN NOT NULL,
    `quantidade_linhas_listas` INTEGER NOT NULL,
    `acesso_externo_sis` BOOLEAN NOT NULL,
    `endereco_IP_primario` VARCHAR(191) NOT NULL,
    `endereco_IP_secundario` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoEmpresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tratamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cargos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_empresa` VARCHAR(191) NOT NULL,
    `tipo_empresa` VARCHAR(191) NULL,
    `patrocinadora` BOOLEAN NULL,
    `faculdade_anestesiologia` BOOLEAN NULL,
    `empresa_ativa` BOOLEAN NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `razao_social` VARCHAR(191) NOT NULL,
    `nome_fantasia` VARCHAR(191) NOT NULL,
    `cep` INTEGER NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` INTEGER NULL,
    `complemento` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `telefone_comercial` VARCHAR(191) NULL,
    `tratamento_contato_primario` VARCHAR(191) NULL,
    `nome_contato_primario` VARCHAR(191) NOT NULL,
    `cargo_contato_primario` VARCHAR(191) NULL,
    `email_contato_primario` VARCHAR(191) NULL,
    `telefone_contato_primario` VARCHAR(191) NULL,
    `tratamento_contato_secundario` VARCHAR(191) NULL,
    `nome_contato_secundario` VARCHAR(191) NULL,
    `cargo_contato_secundario` VARCHAR(191) NULL,
    `email_contato_secundario` VARCHAR(191) NULL,
    `telefone_contato_secundario` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tabelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_tabela` VARCHAR(191) NOT NULL,
    `ocorrencia_tabela` VARCHAR(191) NOT NULL,
    `complemento_ocorrencia_selecao` VARCHAR(191) NULL,
    `ocorrencia_ativa` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
