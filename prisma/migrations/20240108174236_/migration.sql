-- CreateTable
CREATE TABLE `Parametros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random` VARCHAR(191) NOT NULL,
    `cep_invalido` BOOLEAN NOT NULL DEFAULT false,
    `data_limite_pgto_antecipado_anuidade` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_anuidade` INTEGER NOT NULL,
    `taxa_pgto_atrasado_anuidade` INTEGER NOT NULL,
    `parcelamento_permitido_anuidade` VARCHAR(191) NOT NULL,
    `data_limite_pgto_antecipado_JAER` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_JAER` INTEGER NOT NULL,
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
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_empresa` VARCHAR(191) NULL,
    `tipo_empresa` VARCHAR(191) NULL,
    `patrocinadora` BOOLEAN NULL,
    `faculdade_anestesiologia` BOOLEAN NULL,
    `empresa_ativa` BOOLEAN NULL,
    `cnpj` VARCHAR(191) NULL,
    `razao_social` VARCHAR(191) NULL,
    `nome_fantasia` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` INTEGER NULL,
    `complemento` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `telefone_comercial` VARCHAR(191) NULL,
    `tratamento_contato_primario` VARCHAR(191) NULL,
    `nome_contato_primario` VARCHAR(191) NULL,
    `cargo_contato_primario` VARCHAR(191) NULL,
    `email_contato_primario` VARCHAR(191) NULL,
    `telefone_contato_primario` VARCHAR(191) NULL,
    `tratamento_contato_secundario` VARCHAR(191) NULL,
    `nome_contato_secundario` VARCHAR(191) NULL,
    `cargo_contato_secundario` VARCHAR(191) NULL,
    `email_contato_secundario` VARCHAR(191) NULL,
    `telefone_contato_secundario` VARCHAR(191) NULL,
    `home_page` VARCHAR(191) NULL,
    `inscricao_estadual` VARCHAR(191) NULL,
    `inscricao_municipal` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,

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

-- CreateTable
CREATE TABLE `Associados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_nascimento` DATETIME(3) NULL,
    `data_inicio_especializacao` VARCHAR(191) NULL,
    `data_previsao_conclusao` VARCHAR(191) NULL,
    `comprovante_cpf` VARCHAR(191) NULL,
    `numero_proposta_SBA` BIGINT NULL,
    `matricula_SAERJ` INTEGER NULL,
    `matricula_SBA` INTEGER NULL,
    `situacao` VARCHAR(191) NULL,
    `uf_crm` VARCHAR(191) NULL,
    `crm` VARCHAR(191) NULL,
    `nome_completo` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `sexo` VARCHAR(191) NULL,
    `nome_profissional` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` INTEGER NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL,
    `telefone_celular` VARCHAR(191) NULL,
    `telefone_residencial` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `nome_instituicao_ensino_graduacao` VARCHAR(191) NULL,
    `ano_conclusao_graduacao` VARCHAR(191) NULL,
    `residencia_mec_cnrm` VARCHAR(191) NULL,
    `nivel_residencia` VARCHAR(191) NULL,
    `nome_hospital_mec` VARCHAR(191) NULL,
    `uf_prm` VARCHAR(191) NULL,
    `comprovante_endereco` VARCHAR(191) NULL,
    `carta_indicacao_2_membros` VARCHAR(191) NULL,
    `declaracao_hospital` VARCHAR(191) NULL,
    `diploma_medicina` VARCHAR(191) NULL,
    `certidao_quitacao_crm` VARCHAR(191) NULL,
    `certificado_conclusao_especializacao` VARCHAR(191) NULL,
    `declaro_verdadeiras` VARCHAR(191) NULL,
    `declaro_quite_SAERJ` VARCHAR(191) NULL,
    `pendencias_SAERJ` VARCHAR(191) NULL,
    `nome_presidente_regional` VARCHAR(191) NULL,
    `sigla_regional` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_log` VARCHAR(191) NOT NULL,
    `ocorrencia_log` VARCHAR(191) NOT NULL,
    `data_hora_log` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
