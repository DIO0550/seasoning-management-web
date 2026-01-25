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
