import { NextRequest, NextResponse } from "next/server";

// 調味料の型定義
interface Seasoning {
  id: string;
  name: string;
  type: string;
  image?: string;
  createdAt: string;
}

// バリデーションエラーの型定義
interface ValidationError {
  field: string;
  message: string;
}

// モックデータ（本来はDBから取得）
export const seasonings: Seasoning[] = [];

// 調味料の種類のEnum
const VALID_SEASONING_TYPES = [
  "salt",
  "sugar",
  "pepper",
  "vinegar",
  "soySauce",
  "other",
];

/**
 * 調味料名のバリデーション
 */
const validateName = (name: string): ValidationError | null => {
  if (!name || name.trim() === "") {
    return { field: "name", message: "調味料名は必須です" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 20) {
    return { field: "name", message: "調味料名は20文字以内で入力してください" };
  }

  // 半角英数字のチェック
  if (!/^[a-zA-Z0-9]+$/.test(trimmedName)) {
    return { field: "name", message: "調味料名は半角英数字で入力してください" };
  }

  return null;
};

/**
 * 調味料の種類のバリデーション
 */
const validateType = (type: string): ValidationError | null => {
  if (!type || type.trim() === "") {
    return { field: "type", message: "調味料の種類を選択してください" };
  }

  if (!VALID_SEASONING_TYPES.includes(type)) {
    return { field: "type", message: "有効な調味料の種類を選択してください" };
  }

  return null;
};

/**
 * 画像のバリデーション（簡易版）
 */
const validateImage = (image?: string): ValidationError | null => {
  if (!image) {
    return null; // 画像は任意なのでnullでもOK
  }

  // Base64形式の簡易チェック
  if (!image.startsWith("data:image/")) {
    return { field: "image", message: "画像形式が正しくありません" };
  }

  // サイズチェック（Base64の概算）- 5MB制限
  const base64Data = image.split(",")[1];
  if (base64Data && base64Data.length > (5 * 1024 * 1024 * 4) / 3) {
    return { field: "image", message: "画像サイズは5MB以下にしてください" };
  }

  return null;
};

/**
 * GET /api/seasoning - 調味料一覧を取得
 */
export async function GET() {
  try {
    return NextResponse.json(seasonings, { status: 200 });
  } catch (error) {
    console.error("調味料一覧取得エラー:", error);
    return NextResponse.json(
      { error: "システムエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seasoning - 新しい調味料を追加
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, image } = body;

    // バリデーション
    const validationErrors: ValidationError[] = [];

    const nameError = validateName(name);
    if (nameError) validationErrors.push(nameError);

    const typeError = validateType(type);
    if (typeError) validationErrors.push(typeError);

    const imageError = validateImage(image);
    if (imageError) validationErrors.push(imageError);

    // バリデーションエラーがある場合
    if (validationErrors.length > 0) {
      const errorDetails: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorDetails[error.field] = error.message;
      });

      return NextResponse.json(
        {
          error: "バリデーションエラーが発生しました",
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    // 重複チェック（名前が同じものがないかチェック）
    const existingSeasoning = seasonings.find((s) => s.name === name.trim());
    if (existingSeasoning) {
      return NextResponse.json(
        {
          error: "バリデーションエラーが発生しました",
          details: {
            name: "この調味料名は既に登録されています",
          },
        },
        { status: 400 }
      );
    }

    // 新しい調味料を作成
    const newSeasoning: Seasoning = {
      id: `seasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      type: type.trim(),
      image: image || undefined,
      createdAt: new Date().toISOString(),
    };

    // モックデータに追加
    seasonings.push(newSeasoning);

    return NextResponse.json(newSeasoning, { status: 201 });
  } catch (error) {
    console.error("調味料追加エラー:", error);

    // JSON解析エラーなどの場合
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "リクエストの形式が正しくありません" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "システムエラーが発生しました" },
      { status: 500 }
    );
  }
}
