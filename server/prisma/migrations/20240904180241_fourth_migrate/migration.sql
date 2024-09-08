-- CreateTable
CREATE TABLE `tb_absensi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NULL,
    `Alamat` VARCHAR(191) NULL,
    `no_telp` INTEGER NULL,
    `keperluan` VARCHAR(191) NULL,
    `keterangan` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
