-- AlterTable
ALTER TABLE `user_details` ADD COLUMN `observations` VARCHAR(191) NULL,
    ADD COLUMN `reference` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(191) NULL;
