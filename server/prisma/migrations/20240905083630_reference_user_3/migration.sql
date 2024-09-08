/*
  Warnings:

  - You are about to drop the column `Alamat` on the `tb_absensi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tb_absensi` DROP COLUMN `Alamat`,
    ADD COLUMN `alamat` VARCHAR(191) NULL;
