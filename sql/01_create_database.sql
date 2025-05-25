-- 01_create_database.sql
-- データベース作成スクリプト

-- 既存のデータベースがある場合は削除しません
CREATE DATABASE IF NOT EXISTS seasoning_management_db
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- データベースを選択
USE seasoning_management_db;