-- 03_create_seasoning_image_table.sql
-- 調味料画像管理テーブル作成スクリプト

USE seasoning_management_db;

-- 調味料画像管理テーブル
CREATE TABLE IF NOT EXISTS seasoning_image (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folder_uuid CHAR(36) NOT NULL,
  filename VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_folder_filename (folder_uuid, filename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;