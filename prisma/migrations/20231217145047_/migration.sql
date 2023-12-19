-- CreateTable
CREATE TABLE `Categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parametros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Random` VARCHAR(191) NOT NULL,
    `CEP_Invalido` BOOLEAN NOT NULL DEFAULT false,
    `Data_Limite_Pgto_Antecipado_Anuidade` DATETIME(3) NULL,
    `Percent_Desc_Pgto_Antecipado_Anuidade` DECIMAL(65, 30) NOT NULL,
    `Taxa_Pgto_Atrasado_Anuidade` DECIMAL(65, 30) NOT NULL,
    `Parcelamento_Permitido_Anuidade_categoriaId` INTEGER NOT NULL,
    `Data_Limite_Pgto_Antecipado_JAER` DATETIME(3) NULL,
    `Percent_Desc_Pgto_Antecipado_JAER` DECIMAL(65, 30) NOT NULL,
    `Taxa_Pgto_Atrasado_JAER` INTEGER NOT NULL,
    `Parcelamento_Permitido_JAER` VARCHAR(191) NOT NULL,
    `Presidente_pode_se_Reeleger` BOOLEAN NOT NULL,
    `Demais_podem_se_reeleger` BOOLEAN NOT NULL,
    `Duracao_Mandato` INTEGER NOT NULL,
    `Exite_Listas_imediato` BOOLEAN NOT NULL,
    `Quantidade_linhas_Listas` INTEGER NOT NULL,
    `Acesso_Externo_Sis` BOOLEAN NOT NULL,
    `Endereco_IP_Prim` VARCHAR(191) NOT NULL,
    `Endereco_IP_Sec` VARCHAR(191) NOT NULL,

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
    `tipo_empresa` VARCHAR(191) NOT NULL,
    `patrocinadora` BOOLEAN NOT NULL,
    `faculdade_anestesiologia` BOOLEAN NOT NULL,
    `empresa_ativa` BOOLEAN NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `razao_social` VARCHAR(191) NOT NULL,
    `nome_fantasia` VARCHAR(191) NOT NULL,
    `cep` INTEGER NOT NULL,
    `logadouro` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `complemento` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `telefone_comercial` VARCHAR(191) NOT NULL,
    `tratamento_contato_primario` VARCHAR(191) NOT NULL,
    `nome_contato_primario` VARCHAR(191) NOT NULL,
    `cargo_contato_primario` VARCHAR(191) NOT NULL,
    `email_contato_primario` VARCHAR(191) NOT NULL,
    `telefone_contato_primario` VARCHAR(191) NOT NULL,
    `tratamento_contato_secundario` VARCHAR(191) NOT NULL,
    `nome_contato_secundario` VARCHAR(191) NOT NULL,
    `cargo_contato_secundario` VARCHAR(191) NOT NULL,
    `email_contato_secundario` VARCHAR(191) NOT NULL,
    `telefone_contato_secundario` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Parametros` ADD CONSTRAINT `Parametros_Parcelamento_Permitido_Anuidade_categoriaId_fkey` FOREIGN KEY (`Parcelamento_Permitido_Anuidade_categoriaId`) REFERENCES `Categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
