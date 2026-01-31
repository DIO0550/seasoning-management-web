# OpenAPI 仕様

## POST /api/seasoning-types

### リクエスト

#### Content-Type

`application/json`

#### Body

```json
{
  "name": "液体調味料"
}
```

### レスポンス

#### 201 Created

`seasoningTypeAddResponseSchema` と同一の構造。

```json
{
  "data": {
    "id": 1,
    "name": "液体調味料",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 400 Bad Request

バリデーションエラーまたは重複名エラー。

```json
{
  "code": "VALIDATION_ERROR_NAME_REQUIRED",
  "message": "入力内容を確認してください",
  "details": [
    {
      "field": "name",
      "message": "調味料の種類名は必須です"
    }
  ]
}
```

重複名や不正 JSON の場合は `details` を省略する。

```json
{
  "code": "DUPLICATE_NAME",
  "message": "入力内容を確認してください"
}
```

#### 500 Internal Server Error

```json
{
  "code": "INTERNAL_ERROR",
  "message": "システムエラーが発生しました"
}
```

## GET /api/seasoning-types/{typeId}

### レスポンス

#### 200 OK

`seasoningTypeDetailResponseSchema` と同一の構造。

```json
{
  "data": {
    "id": 1,
    "name": "液体調味料",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 400 Bad Request

無効な `typeId` を指定した場合。

```json
{
  "code": "INVALID_PARAMETER",
  "message": "無効なパラメータです",
  "details": [
    {
      "field": "typeId",
      "message": "Expected number, received nan"
    }
  ]
}
```

#### 404 Not Found

```json
{
  "code": "NOT_FOUND",
  "message": "seasoning-type with id 999 not found"
}
```

## DELETE /api/seasoning-types/{typeId}

### レスポンス

#### 204 No Content

レスポンスボディはありません。

#### 400 Bad Request

無効な `typeId` を指定した場合。

```json
{
  "code": "INVALID_PARAMETER",
  "message": "無効なパラメータです",
  "details": [
    {
      "field": "typeId",
      "message": "Expected number, received nan"
    }
  ]
}
```

#### 404 Not Found

```json
{
  "code": "NOT_FOUND",
  "message": "seasoning-type with id 999 not found"
}
```

#### 409 Conflict

```json
{
  "code": "CONFLICT",
  "message": "関連データが存在するため削除できません"
}
```

#### 500 Internal Server Error

```json
{
  "code": "INTERNAL_ERROR",
  "message": "システムエラーが発生しました"
}
```

## GET /api/seasoning-templates

### リクエスト

#### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| page | number | 任意 | ページ番号（1以上） |
| pageSize | number | 任意 | 1ページあたりの件数（1〜100） |
| search | string | 任意 | 検索キーワード（50文字以内） |

### レスポンス

#### 200 OK

`seasoningTemplateListResponseSchema` と同一の構造。

```json
{
  "data": [
    {
      "id": 1,
      "name": "だし醤油",
      "typeId": 2,
      "imageId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

#### 400 Bad Request

バリデーションエラー。

```json
{
  "code": "VALIDATION_ERROR_PAGE_INVALID",
  "message": "入力内容を確認してください",
  "details": [
    {
      "field": "page",
      "message": "ページ番号は1以上である必要があります"
    }
  ]
}
```

#### 500 Internal Server Error

```json
{
  "code": "INTERNAL_ERROR",
  "message": "システムエラーが発生しました"
}
```
