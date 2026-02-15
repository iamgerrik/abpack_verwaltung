-- Migration: Replace Manus OAuth with username/password auth
-- Drop old columns
ALTER TABLE `users` DROP COLUMN IF EXISTS `openId`;
ALTER TABLE `users` DROP COLUMN IF EXISTS `loginMethod`;

-- Add new columns
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `username` varchar(64) NOT NULL UNIQUE;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `password` varchar(255) NOT NULL;

-- Note: Run seed-users.ts script after this migration to create initial users
