/*
  Warnings:

  - You are about to drop the column `data_pagto_unica` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `valor_pagto_unica` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `data_encerramento_protocolo` on the `protocolos` table. All the data in the column will be lost.
  - You are about to drop the column `doc_entrada_requer_resposta` on the `protocolos` table. All the data in the column will be lost.
  - You are about to drop the column `quem_redigiu_documento_a_ser_enviado` on the `protocolos` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_encerramento_protocolo` on the `protocolos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chapas` MODIFY `titulo_chapa` VARCHAR(191) NULL,
    MODIFY `nome_presidente` VARCHAR(191) NULL,
    MODIFY `data_formacao` DATETIME(3) NULL,
    MODIFY `pessoas_compoe` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `empresa` MODIFY `numero` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pagamentos` DROP COLUMN `data_pagto_unica`,
    DROP COLUMN `valor_pagto_unica`,
    ADD COLUMN `data_pagto_unico` DATETIME(3) NULL,
    ADD COLUMN `valor_pagto_unico` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `parametros` ADD COLUMN `permitir_dado_invalido` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `protocolos` DROP COLUMN `data_encerramento_protocolo`,
    DROP COLUMN `doc_entrada_requer_resposta`,
    DROP COLUMN `quem_redigiu_documento_a_ser_enviado`,
    DROP COLUMN `usuario_encerramento_protocolo`,
    ADD COLUMN `data_encerramento` DATETIME(3) NULL,
    ADD COLUMN `obrigatoria_resp_receb` BOOLEAN NULL,
    ADD COLUMN `quem_redigiu_envio` VARCHAR(191) NULL,
    ADD COLUMN `usuario_encerramento` VARCHAR(191) NULL,
    MODIFY `assunto_protocolo` VARCHAR(255) NULL;
