-- =====================================================
-- SAI SPORTS DATABASE SCHEMA
-- Database: sai_sports
-- Database Engine: MariaDB/MySQL
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS `sai_sports` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `sai_sports`;

-- =====================================================
-- Table: contact_messages
-- Description: Stores all contact form submissions from the website
-- =====================================================
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(36) NOT NULL COMMENT 'UUID primary key',
  `name` VARCHAR(255) NOT NULL COMMENT 'Contact person full name',
  `email` VARCHAR(255) NOT NULL COMMENT 'Contact person email address',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT 'Contact person phone number (optional)',
  `message` TEXT NOT NULL COMMENT 'Message content from contact form',
  `timestamp` DATETIME NOT NULL COMMENT 'Timestamp when message was submitted',
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Contact form submissions from SAI Sports website';

-- =====================================================
-- Table: status_checks
-- Description: Stores system status check records
-- =====================================================
CREATE TABLE IF NOT EXISTS `status_checks` (
  `id` VARCHAR(36) NOT NULL COMMENT 'UUID primary key',
  `client_name` VARCHAR(255) NOT NULL COMMENT 'Name of the client/service checking status',
  `timestamp` DATETIME NOT NULL COMMENT 'Timestamp of the status check',
  PRIMARY KEY (`id`),
  INDEX `idx_client_name` (`client_name`),
  INDEX `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='System status check records';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
