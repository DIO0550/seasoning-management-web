-- 04_create_seasoning_table.sql
-- 調味料管理テーブル作成スクリプト

USE seasoning_management_db;

-- 調味料管理テーブル
CREATE TABLE IF NOT EXISTS seasoning (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  type_id INT NOT NULL,
  image_id INT,
  best_before_at DATE,
  expires_at DATE,
  purchased_at DATE,
  created_at DATE NOT NULL,
  update_at DATE NOT NULL,
  INDEX idx_type_id (type_id),
  INDEX idx_image_id (image_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;