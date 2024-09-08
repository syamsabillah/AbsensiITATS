-- AddForeignKey
ALTER TABLE `tb_absensi` ADD CONSTRAINT `tb_absensi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tb_user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
