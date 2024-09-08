-- AlterTable
ALTER TABLE `tb_absensi` ADD COLUMN `aslab_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `tb_absensi` ADD CONSTRAINT `tb_absensi_aslab_id_fkey` FOREIGN KEY (`aslab_id`) REFERENCES `tb_user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
