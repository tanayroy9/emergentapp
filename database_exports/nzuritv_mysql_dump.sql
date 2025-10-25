-- Nzuri Digital TV Database Export
-- Date: 2025-10-25
-- Database: nzuri_tv

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create database
CREATE DATABASE IF NOT EXISTS `nzuri_tv` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nzuri_tv`;

-- Table: channels
DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) UNIQUE,
  `description` text,
  `default_embed_url` text,
  `created_at` datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: programs
DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs` (
  `id` varchar(36) PRIMARY KEY,
  `channel_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `tags` varchar(255),
  `content_type` varchar(50) DEFAULT 'video',
  `youtube_link` varchar(1024),
  `uploaded_media_path` varchar(1024),
  `duration_seconds` int,
  `created_by` varchar(36),
  `created_at` datetime,
  FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: schedule_items
DROP TABLE IF EXISTS `schedule_items`;
CREATE TABLE `schedule_items` (
  `id` varchar(36) PRIMARY KEY,
  `program_id` varchar(36) NOT NULL,
  `channel_id` varchar(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_live` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'scheduled',
  `created_at` datetime,
  `updated_at` datetime,
  FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: tickers
DROP TABLE IF EXISTS `tickers`;
CREATE TABLE `tickers` (
  `id` varchar(36) PRIMARY KEY,
  `text` text NOT NULL,
  `priority` int DEFAULT 5,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'editor',
  `created_at` datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: ads
DROP TABLE IF EXISTS `ads`;
CREATE TABLE `ads` (
  `id` varchar(36) PRIMARY KEY,
  `title` varchar(255),
  `image_url` varchar(1024),
  `click_url` varchar(1024),
  `priority` int DEFAULT 10,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data

-- Channels
INSERT INTO `channels` (`id`, `name`, `slug`, `description`, `created_at`) VALUES ('fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Nzuri TV', 'nzuri-tv', 'Local and international news covering economy, sports, mining, green energy, music and entertainment', '2025-10-12T05:00:37.574744Z');

-- Programs
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('e47d7f5f-4f16-40aa-9285-db42f77a9c58', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Big Buck Bunny', 'Blender animated short film', '06:00-09:00', 'video', 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&loop=1&playlist=aqz-KE-bpKQ', 10800, 'system', '2025-10-24T19:43:17.201207Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('c8803fc8-1793-4bb1-aeae-05f76cc4a841', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Sintel', 'Blender dragon tale', '09:00-12:00', 'video', 'https://www.youtube.com/embed/eRsGyueVLvQ?autoplay=1&mute=1&loop=1&playlist=eRsGyueVLvQ', 10800, 'system', '2025-10-24T19:43:17.277580Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('a9fc32e2-5945-4d0b-99b3-52aaf4664558', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Tears of Steel', 'Blender sci-fi short', '12:00-15:00', 'video', 'https://www.youtube.com/embed/R6MlUcmOul8?autoplay=1&mute=1&loop=1&playlist=R6MlUcmOul8', 10800, 'system', '2025-10-24T19:43:17.316003Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('f293b4fc-212b-47df-8bb7-a511cb682756', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Elephants Dream', 'Surreal animation', '15:00-18:00', 'video', 'https://www.youtube.com/embed/TLkA0RELQ1g?autoplay=1&mute=1&loop=1&playlist=TLkA0RELQ1g', 10800, 'system', '2025-10-24T19:43:17.351049Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('f770b3f4-d286-4bf3-8809-685b08140606', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Cosmos Laundromat', 'Blender comedy', '18:00-21:00', 'video', 'https://www.youtube.com/embed/Y-rmzh0PI3c?autoplay=1&mute=1&loop=1&playlist=Y-rmzh0PI3c', 10800, 'system', '2025-10-24T19:43:17.385212Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('dc799e5c-3748-4b2a-9d09-277a69e0f333', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Spring', 'Nature animation', '21:00-00:00', 'video', 'https://www.youtube.com/embed/WhWc3b3KhnY?autoplay=1&mute=1&loop=1&playlist=WhWc3b3KhnY', 10800, 'system', '2025-10-24T19:43:17.419607Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('28699a78-d39d-4935-9216-d10ffc4fba16', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Agent 327', 'Action spy comedy', '00:00-03:00', 'video', 'https://www.youtube.com/embed/mN0zPOpADL4?autoplay=1&mute=1&loop=1&playlist=mN0zPOpADL4', 10800, 'system', '2025-10-24T19:43:17.455124Z');
INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES ('6a74cef4-979c-4c6a-8ad7-ac9599bcee81', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', 'Caminandes', 'Llama comedy short', '03:00-06:00', 'video', 'https://www.youtube.com/embed/SkVqJ1SGeL0?autoplay=1&mute=1&loop=1&playlist=SkVqJ1SGeL0', 10800, 'system', '2025-10-24T19:43:17.491351Z');

-- Tickers
INSERT INTO `tickers` (`id`, `text`, `priority`, `active`, `created_at`) VALUES ('102e325d-7821-44a3-a48d-6be98274a8d5', 'BREAKING: Local mining sector reports 15% growth this quarter', 1, 1, '2025-10-12T05:10:39.948254Z');
INSERT INTO `tickers` (`id`, `text`, `priority`, `active`, `created_at`) VALUES ('e1aae3a6-5592-4e15-a5a0-5a959f45066b', 'Green Energy Summit 2025 kicks off next week in Johannesburg', 2, 1, '2025-10-12T05:10:47.189125Z');
INSERT INTO `tickers` (`id`, `text`, `priority`, `active`, `created_at`) VALUES ('f346e6e1-02dc-4618-8544-1db27ffbe8c4', 'Sports: National team qualifies for international championship', 3, 1, '2025-10-12T05:10:54.375660Z');

-- Schedule Items (sample - first 20)
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('791c463c-1341-4971-bba5-f219e26b2b0e', '28699a78-d39d-4935-9216-d10ffc4fba16', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T00:00:00Z', '2025-10-24T03:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.743612Z', '2025-10-24T19:43:17.743615Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('962ac1ea-9333-459e-9f1c-78473743f079', '6a74cef4-979c-4c6a-8ad7-ac9599bcee81', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T03:00:00Z', '2025-10-24T06:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.778577Z', '2025-10-24T19:43:17.778580Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('386e8825-8e7b-4883-90ff-d3b3c30bb970', 'e47d7f5f-4f16-40aa-9285-db42f77a9c58', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T06:00:00Z', '2025-10-24T09:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.528061Z', '2025-10-24T19:43:17.528064Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('7b336c3f-a526-4489-9f3a-5793126c0076', 'c8803fc8-1793-4bb1-aeae-05f76cc4a841', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T09:00:00Z', '2025-10-24T12:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.562928Z', '2025-10-24T19:43:17.562932Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('eef98661-3cf8-4b31-bb67-dd883ea379f9', 'a9fc32e2-5945-4d0b-99b3-52aaf4664558', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T12:00:00Z', '2025-10-24T15:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.599053Z', '2025-10-24T19:43:17.599055Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('71143117-83c9-4344-8f46-f84feb6277b8', 'f293b4fc-212b-47df-8bb7-a511cb682756', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T15:00:00Z', '2025-10-24T18:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.634767Z', '2025-10-24T19:43:17.634769Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('a68e27b0-3e3b-45ae-a9a8-352d9203d966', 'f770b3f4-d286-4bf3-8809-685b08140606', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T18:00:00Z', '2025-10-24T21:00:00Z', 0, 'completed', '2025-10-24T19:43:17.670836Z', '2025-10-25T10:04:23.935925Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('9cdec318-d834-4914-ae4a-a7b576f309d0', 'dc799e5c-3748-4b2a-9d09-277a69e0f333', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-24T21:00:00Z', '2025-10-25T00:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.708183Z', '2025-10-24T19:43:17.708185Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('e9315135-4492-409c-8ab3-af52ac44b747', '28699a78-d39d-4935-9216-d10ffc4fba16', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T00:00:00Z', '2025-10-25T03:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.034101Z', '2025-10-24T19:43:18.034104Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('9a56fa42-b123-4968-b13f-0d0afbcf3daf', '6a74cef4-979c-4c6a-8ad7-ac9599bcee81', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T03:00:00Z', '2025-10-25T06:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.069056Z', '2025-10-24T19:43:18.069058Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('42ce6b7b-4ff9-4a17-a3c4-61896ecc0ca9', 'e47d7f5f-4f16-40aa-9285-db42f77a9c58', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T06:00:00Z', '2025-10-25T09:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.814051Z', '2025-10-24T19:43:17.814054Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('1924c28f-0073-4a62-819b-4c48b1377cc8', 'c8803fc8-1793-4bb1-aeae-05f76cc4a841', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T09:00:00Z', '2025-10-25T12:00:00Z', 0, 'running', '2025-10-24T19:43:17.851436Z', '2025-10-25T10:04:23.935925Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('a99d5a51-43f7-459f-9b07-271643413ce3', 'a9fc32e2-5945-4d0b-99b3-52aaf4664558', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T12:00:00Z', '2025-10-25T15:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.887701Z', '2025-10-24T19:43:17.887704Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('104e0732-859c-403c-9bdf-39ca6c43f682', 'f293b4fc-212b-47df-8bb7-a511cb682756', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T15:00:00Z', '2025-10-25T18:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.924768Z', '2025-10-24T19:43:17.924770Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('3df00162-3c02-4882-aef3-4b782830ecea', 'f770b3f4-d286-4bf3-8809-685b08140606', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T18:00:00Z', '2025-10-25T21:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.959367Z', '2025-10-24T19:43:17.959369Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('3f0b4d04-b3c7-4e5a-8530-8e08ab436d17', 'dc799e5c-3748-4b2a-9d09-277a69e0f333', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-25T21:00:00Z', '2025-10-26T00:00:00Z', 0, 'scheduled', '2025-10-24T19:43:17.996054Z', '2025-10-24T19:43:17.996056Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('9f344251-730d-4647-8bed-f2edcb298071', '28699a78-d39d-4935-9216-d10ffc4fba16', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-26T00:00:00Z', '2025-10-26T03:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.321124Z', '2025-10-24T19:43:18.321126Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('76f5b8ae-768d-4bff-b3f6-8b1407eff8d7', '6a74cef4-979c-4c6a-8ad7-ac9599bcee81', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-26T03:00:00Z', '2025-10-26T06:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.358324Z', '2025-10-24T19:43:18.358327Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('1d14f6e5-f8e0-478f-8377-28b6eb77b90e', 'e47d7f5f-4f16-40aa-9285-db42f77a9c58', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-26T06:00:00Z', '2025-10-26T09:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.104142Z', '2025-10-24T19:43:18.104145Z');
INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES ('659db779-0a72-4c1f-90ae-d9128b538bcf', 'c8803fc8-1793-4bb1-aeae-05f76cc4a841', 'fd552196-c42d-43dd-9ba2-203ee796eb4b', '2025-10-26T09:00:00Z', '2025-10-26T12:00:00Z', 0, 'scheduled', '2025-10-24T19:43:18.140770Z', '2025-10-24T19:43:18.140773Z');

SET FOREIGN_KEY_CHECKS = 1;

-- Export complete!
-- Total: 1 channels, 8 programs, 56 schedules, 3 tickers
