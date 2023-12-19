-- AlterTable
ALTER TABLE `Empresa` MODIFY `cep` INTEGER NULL,
    MODIFY `numero` INTEGER NULL,
    MODIFY `complemento` VARCHAR(191) NULL,
    MODIFY `cidade` VARCHAR(191) NULL,
    MODIFY `uf` VARCHAR(191) NULL,
    MODIFY `pais` VARCHAR(191) NULL,
    MODIFY `bairro` VARCHAR(191) NULL,
    MODIFY `logradouro` VARCHAR(191) NULL;
