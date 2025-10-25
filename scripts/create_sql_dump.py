#!/usr/bin/env python3
import json
from datetime import datetime

# Load the exported data
with open('/app/database_exports/nzuritv_data_export.json', 'r') as f:
    data = json.load(f)

sql_dump = """-- Nzuri Digital TV Database Export
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
"""

# Insert channels
if data['channels']:
    sql_dump += "\n-- Channels\n"
    for ch in data['channels']:
        sql_dump += f"INSERT INTO `channels` (`id`, `name`, `slug`, `description`, `created_at`) VALUES "
        sql_dump += f"('{ch['id']}', '{ch['name']}', '{ch.get('slug', '')}', "
        sql_dump += f"'{ch.get('description', '')}', '{ch.get('created_at', '')}');\n"

# Insert programs
if data['programs']:
    sql_dump += "\n-- Programs\n"
    for p in data['programs']:
        desc = p.get('description', '').replace("'", "''")
        sql_dump += f"INSERT INTO `programs` (`id`, `channel_id`, `title`, `description`, `tags`, `content_type`, `youtube_link`, `duration_seconds`, `created_by`, `created_at`) VALUES "
        sql_dump += f"('{p['id']}', '{p['channel_id']}', '{p['title']}', '{desc}', "
        sql_dump += f"'{p.get('tags', '')}', '{p.get('content_type', 'video')}', '{p.get('youtube_link', '')}', "
        sql_dump += f"{p.get('duration_seconds', 1800)}, '{p.get('created_by', 'system')}', '{p.get('created_at', '')}');\n"

# Insert tickers
if data['tickers']:
    sql_dump += "\n-- Tickers\n"
    for t in data['tickers']:
        text = t['text'].replace("'", "''")
        sql_dump += f"INSERT INTO `tickers` (`id`, `text`, `priority`, `active`, `created_at`) VALUES "
        sql_dump += f"('{t['id']}', '{text}', {t.get('priority', 5)}, {1 if t.get('active') else 0}, '{t.get('created_at', '')}');\n"

# Insert schedule (first 20 items)
if data['schedule_items']:
    sql_dump += "\n-- Schedule Items (sample - first 20)\n"
    for s in data['schedule_items'][:20]:
        sql_dump += f"INSERT INTO `schedule_items` (`id`, `program_id`, `channel_id`, `start_time`, `end_time`, `is_live`, `status`, `created_at`, `updated_at`) VALUES "
        sql_dump += f"('{s['id']}', '{s['program_id']}', '{s['channel_id']}', '{s['start_time']}', '{s['end_time']}', "
        sql_dump += f"{1 if s.get('is_live') else 0}, '{s.get('status', 'scheduled')}', '{s.get('created_at', '')}', '{s.get('updated_at', '')}');\n"

sql_dump += "\nSET FOREIGN_KEY_CHECKS = 1;\n"
sql_dump += "\n-- Export complete!\n"
sql_dump += f"-- Total: {len(data['channels'])} channels, {len(data['programs'])} programs, {len(data['schedule_items'])} schedules, {len(data['tickers'])} tickers\n"

# Save SQL dump
with open('/app/database_exports/nzuritv_mysql_dump.sql', 'w') as f:
    f.write(sql_dump)

print("✅ MySQL SQL dump created successfully!")
print(f"   Location: /app/database_exports/nzuritv_mysql_dump.sql")
print(f"\n📊 Summary:")
print(f"   - Channels: {len(data['channels'])}")
print(f"   - Programs: {len(data['programs'])}")
print(f"   - Schedule Items: {len(data['schedule_items'])} (showing first 20 in SQL)")
print(f"   - Tickers: {len(data['tickers'])}")
