---
applyTo: "**"
---

# データベース定義

- 外部キー制約は使わないこと。

## データベース情報

- データベース名: `seasoning_management_db`
- キャラクターセット: `utf8mb4`
- コレーション: `utf8mb4_unicode_ci`

## SQLファイル構成

- `01_create_database.sql`: データベース作成スクリプト
- `02_create_seasoning_type_table.sql`: 調味料種類管理テーブル作成スクリプト
- `03_create_seasoning_image_table.sql`: 調味料画像管理テーブル作成スクリプト
- `04_create_seasoning_table.sql`: 調味料管理テーブル作成スクリプト

## 調味料管理テーブル

### 基本情報

#### 名前

- seasoning

#### 説明

- 調味料の基本データを管理する

## カラム定義

|    カラム名    |      型      | 主キー | auto increment | NOT NULL | デフォルト |                  説明                   | 備考 |
| :------------: | :----------: | :----: | :------------: | :------: | :--------: | :-------------------------------------: | :--: |
|       id       |     INT      |   ◯    |       ◯        |    ◯     |            |            テーブルの主キー             |      |
|      name      | VARCHAR(256) |        |                |    ◯     |            |                調味料名                 |      |
|    type_id     |     INT      |        |                |    ◯     |            | 調味料の種類。調味料管理テーブルの ID。 |      |
|    image_id    |     INT      |        |                |          |            |  調味料の画像。調味料画像テーブルの ID  |      |
| best_before_at |     DATE     |        |                |          |            |                消費期限                 |      |
|   expires_at   |     DATE     |        |                |          |            |                賞味期限                 |      |
|  purchased_at  |     DATE     |        |                |          |            |                 購入日                  |      |
|   created_at   |     DATE     |        |                |    ◯     |            |                登録日時                 |      |
|   update_at    |     DATE     |        |                |    ◯     |            |                更新日時                 |      |

## 調味料種類管理テーブル

### 名前

- seasoning_type

### 説明

- 調味料の種類管理テーブル

### カラム定義

|  カラム名  |      型      | 主キー | auto increment | NOT NULL | デフォルト |       説明       | 備考 |
| :--------: | :----------: | :----: | :------------: | :------: | :--------: | :--------------: | :--: |
|     id     |     int      |   ◯    |       ◯        |    ◯     |            | テーブルの主キー |      |
|    name    | VARCHAR(256) |        |                |    ◯     |            |   調味料種類名   |      |
| created_at |     DATE     |        |                |    ◯     |            |     登録日時     |      |
| update_at  |     DATE     |        |                |    ◯     |            |     更新日時     |      |

## 調味料画像管理テーブル

### 名前

- seasoning_image

### 説明

- 調味料の画像管理テーブル

### カラム定義

|  カラム名   |     型      | 主キー | auto increment | NOT NULL |    デフォルト     |       説明       |      備考       |
| :---------: | :---------: | :----: | :------------: | :------: | :---------------: | :--------------: | :-------------: |
|     id      |     int     |   ◯    |       ◯        |    ◯     |                   | テーブルの主キー |                 |
| folder_uuid |  CHAR(36)   |        |                |    ◯     |                   |  フォルダ UUID   |  ユニーク制約   |
|  filename   | VARCHAR(50) |        |                |    ◯     |                   |  固定ファイル名  | 'image.jpg'など |
| created_at  |  TIMESTAMP  |        |                |    ◯     | CURRENT_TIMESTAMP |     登録日時     |                 |
| updated_at  |  TIMESTAMP  |        |                |    ◯     | CURRENT_TIMESTAMP |     更新日時     |                 |
