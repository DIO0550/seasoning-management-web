-- 05_create_seasoning_template_table.sql
-- 調味料テンプレート管理テーブル作成スクリプト

USE seasoning_management_db;

-- 調味料テンプレート管理テーブル
CREATE TABLE IF NOT EXISTS seasoning_template (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  type_id INT NOT NULL,
  image_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type_id (type_id),
  INDEX idx_image_id (image_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
