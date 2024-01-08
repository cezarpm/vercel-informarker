/*
  Warnings:

  - You are about to alter the column `percent_desc_pgto_antecipado_anuidade` on the `Parametros` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `taxa_pgto_atrasado_anuidade` on the `Parametros` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `percent_desc_pgto_antecipado_JAER` on the `Parametros` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Parametros` MODIFY `percent_desc_pgto_antecipado_anuidade` INTEGER NOT NULL,
    MODIFY `taxa_pgto_atrasado_anuidade` INTEGER NOT NULL,
    MODIFY `percent_desc_pgto_antecipado_JAER` INTEGER NOT NULL;
