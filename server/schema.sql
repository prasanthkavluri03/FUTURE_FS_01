-- ============================================================
-- Portfolio Website Database Setup Script (MySQL)
-- ============================================================

-- Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS `portfolio_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- Create contacts table
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
