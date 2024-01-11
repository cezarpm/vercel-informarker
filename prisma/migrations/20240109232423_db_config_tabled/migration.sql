-- CreateTable
CREATE TABLE `Protocolo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_protocolo` VARCHAR(191) NULL,
    `assunto_protocolo` VARCHAR(191) NULL,
    `tipo_protocolo` VARCHAR(191) NULL,
    `data_recebimento` DATETIME(3) NULL,
    `data_envio` DATETIME(3) NULL,
    `meio_recebimento` VARCHAR(191) NULL,
    `meio_envio` VARCHAR(191) NULL,
    `quem_redigiu_documento_a_ser_enviado` VARCHAR(191) NULL,
    `entregue_em_maos` BOOLEAN NULL,
    `doc_entrada_requer_resposta` BOOLEAN NULL,
    `anexos` VARCHAR(191) NULL,
    `data_encerramento_protocolo` DATETIME(3) NULL,
    `usuario_encerramento_protocolo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
