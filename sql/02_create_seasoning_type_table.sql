-- 02_create_seasoning_type_table.sql
-- 調味料種類管理テーブル作成スクリプト

USE seasoning_management_db;

-- 調味料種類管理テーブル
CREATE TABLE IF NOT EXISTS seasoning_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  created_at DATE NOT NULL,
  update_at DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;