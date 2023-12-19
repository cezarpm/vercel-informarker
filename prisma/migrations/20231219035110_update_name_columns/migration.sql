/*
  Warnings:

  - You are about to drop the column `Acesso_Externo_Sis` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `CEP_Invalido` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Data_Limite_Pgto_Antecipado_Anuidade` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Data_Limite_Pgto_Antecipado_JAER` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Demais_podem_se_reeleger` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Duracao_Mandato` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Endereco_IP_Prim` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Endereco_IP_Sec` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Exite_Listas_imediato` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Parcelamento_Permitido_Anuidade_categoriaId` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Parcelamento_Permitido_JAER` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Percent_Desc_Pgto_Antecipado_Anuidade` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Percent_Desc_Pgto_Antecipado_JAER` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Presidente_pode_se_Reeleger` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Quantidade_linhas_Listas` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Random` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Taxa_Pgto_Atrasado_Anuidade` on the `Parametros` table. All the data in the column will be lost.
  - You are about to drop the column `Taxa_Pgto_Atrasado_JAER` on the `Parametros` table. All the data in the column will be lost.
  - Added the required column `acesso_externo_sis` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorias` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `demais_podem_se_reeleger` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao_mandato` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco_IP_primario` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco_IP_secundario` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exite_listas_imediato` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelamento_permitido_JAER` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelamento_permitido_anuidade` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percent_desc_pgto_antecipado_JAER` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percent_desc_pgto_antecipado_anuidade` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presidente_pode_se_reeleger` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidade_linhas_listas` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `random` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxa_pgto_atrasado_JAER` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxa_pgto_atrasado_anuidade` to the `Parametros` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Parametros` DROP FOREIGN KEY `Parametros_Parcelamento_Permitido_Anuidade_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `Parametros` DROP COLUMN `Acesso_Externo_Sis`,
    DROP COLUMN `CEP_Invalido`,
    DROP COLUMN `Data_Limite_Pgto_Antecipado_Anuidade`,
    DROP COLUMN `Data_Limite_Pgto_Antecipado_JAER`,
    DROP COLUMN `Demais_podem_se_reeleger`,
    DROP COLUMN `Duracao_Mandato`,
    DROP COLUMN `Endereco_IP_Prim`,
    DROP COLUMN `Endereco_IP_Sec`,
    DROP COLUMN `Exite_Listas_imediato`,
    DROP COLUMN `Parcelamento_Permitido_Anuidade_categoriaId`,
    DROP COLUMN `Parcelamento_Permitido_JAER`,
    DROP COLUMN `Percent_Desc_Pgto_Antecipado_Anuidade`,
    DROP COLUMN `Percent_Desc_Pgto_Antecipado_JAER`,
    DROP COLUMN `Presidente_pode_se_Reeleger`,
    DROP COLUMN `Quantidade_linhas_Listas`,
    DROP COLUMN `Random`,
    DROP COLUMN `Taxa_Pgto_Atrasado_Anuidade`,
    DROP COLUMN `Taxa_Pgto_Atrasado_JAER`,
    ADD COLUMN `acesso_externo_sis` BOOLEAN NOT NULL,
    ADD COLUMN `categorias` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep_invalido` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `data_limite_pgto_antecipado_JAER` DATETIME(3) NULL,
    ADD COLUMN `data_limite_pgto_antecipado_anuidade` DATETIME(3) NULL,
    ADD COLUMN `demais_podem_se_reeleger` BOOLEAN NOT NULL,
    ADD COLUMN `duracao_mandato` INTEGER NOT NULL,
    ADD COLUMN `endereco_IP_primario` VARCHAR(191) NOT NULL,
    ADD COLUMN `endereco_IP_secundario` VARCHAR(191) NOT NULL,
    ADD COLUMN `exite_listas_imediato` BOOLEAN NOT NULL,
    ADD COLUMN `parcelamento_permitido_JAER` VARCHAR(191) NOT NULL,
    ADD COLUMN `parcelamento_permitido_anuidade` VARCHAR(191) NOT NULL,
    ADD COLUMN `percent_desc_pgto_antecipado_JAER` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `percent_desc_pgto_antecipado_anuidade` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `presidente_pode_se_reeleger` BOOLEAN NOT NULL,
    ADD COLUMN `quantidade_linhas_listas` INTEGER NOT NULL,
    ADD COLUMN `random` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxa_pgto_atrasado_JAER` INTEGER NOT NULL,
    ADD COLUMN `taxa_pgto_atrasado_anuidade` DECIMAL(65, 30) NOT NULL;
