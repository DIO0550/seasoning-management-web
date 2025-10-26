import { NextRequest, NextResponse } from "next/server";
import { seasoningAddRequestSchema } from "@/types/api/seasoning/add/schemas";
import { SeasoningAddErrorCode } from "@/types/api/seasoning/add/errorCode";
import type { SeasoningAddErrorCode as SeasoningAddErrorCodeType } from "@/types/api/seasoning/add/errorCode";
import type { ErrorResponse } from "@/types/api/common/types";
import {
  SeasoningListQuerySchema,
  type SeasoningListResponse,
  type ErrorResponse as ApiErrorResponse,
} from "@/types/api/seasoning/list/types";
import {
  calculateDaysUntilExpiry,
  ExpiryStatusUtils,
} from "@/features/seasoning/utils/expiry-status";
import { SeasoningCollections } from "@/domain/collections/SeasoningCollection";
import { SeasoningApiErrorCodes } from "@/constants/api/seasonings/error-codes";
import type { SeasoningListItem } from "@/types/seasoning";

// 調味料の型定義（新しい形式）
interface Seasoning {
  id: string;
  name: string;
  seasoningTypeId: number;
  image?: string;
  createdAt: string;
}

// モックデータ（本来はDBから取得）
// Note: テスト用にexportしているが、本番ではリポジトリから取得する
export const seasonings: Seasoning[] = [];

/**
 * GET /api/seasonings - 調味料一覧を取得
 * OpenAPI仕様に準拠
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータの取得とバリデーション
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    const validationResult = SeasoningListQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errorResponse: ApiErrorResponse = {
        code: SeasoningApiErrorCodes.validation,
        message: "入力内容を確認してください",
        details: validationResult.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const query = validationResult.data;
    const { page, pageSize } = query;

    // TODO: リポジトリからデータ取得（現在はモックデータ）
    // モックデータを SeasoningListItem 形式に変換
    const seasoningItems: SeasoningListItem[] = seasonings.map((s) => {
      const expiryDate = null; // モックデータには期限情報がない
      const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
      const expiryStatus = ExpiryStatusUtils.fromDays(daysUntilExpiry);

      return {
        // TODO: リポジトリ実装時に削除（モックデータ専用のID解析ロジック）
        id: Number.parseInt(s.id.split("_")[1] || "1"),
        name: s.name,
        typeId: s.seasoningTypeId,
        bestBeforeAt: undefined,
        expiresAt: undefined,
        purchasedAt: undefined,
        daysUntilExpiry: daysUntilExpiry ?? undefined,
        expiryStatus,
      };
    });

    const baseCollection = SeasoningCollections.from(seasoningItems);
    const collection = SeasoningCollections.applyQuery(baseCollection, query);

    // サマリー計算（フィルタリング前の全データから）
    const summary = SeasoningCollections.calculateSummary(baseCollection);

    // ページネーション
    const paginationResult = SeasoningCollections.paginate(
      collection,
      page,
      pageSize
    );

    // ドメイン型からAPI型への変換
    const apiItems = paginationResult.items.map((item) => ({
      id: item.id,
      name: item.name,
      typeId: item.typeId,
      imageId: null, // モックデータには画像情報がない
      bestBeforeAt: item.bestBeforeAt?.toISOString() ?? null,
      expiresAt: item.expiresAt?.toISOString() ?? null,
      purchasedAt: item.purchasedAt?.toISOString() ?? null,
      daysUntilExpiry: item.daysUntilExpiry ?? null,
      expiryStatus: item.expiryStatus,
    }));

    const response: SeasoningListResponse = {
      data: apiItems,
      meta: {
        page: paginationResult.page,
        pageSize: paginationResult.pageSize,
        totalItems: paginationResult.totalItems,
        totalPages: paginationResult.totalPages,
        hasNext: paginationResult.hasNext,
        hasPrevious: paginationResult.hasPrevious,
      },
      summary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("調味料一覧取得エラー:", error);

    const errorResponse: ApiErrorResponse = {
      code: SeasoningApiErrorCodes.internal,
      message: "システムエラーが発生しました",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST /api/seasonings - 新しい調味料を追加
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodスキーマでバリデーション
    const validationResult = seasoningAddRequestSchema.safeParse(body);

    if (!validationResult.success) {
      // バリデーションエラーの種類に応じて適切なエラーコードを決定
      const errorCode = SeasoningAddErrorCode.fromValidationError(
        validationResult.error
      );

      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: errorCode,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, seasoningTypeId, image } = validationResult.data;

    // 重複チェック（名前が同じものがないかチェック）
    const existingSeasoning = seasonings.find((s) => s.name === name);
    if (existingSeasoning) {
      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: "DUPLICATE_NAME",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 新しい調味料を作成
    const newSeasoning: Seasoning = {
      id: `seasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      seasoningTypeId: seasoningTypeId,
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
      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: SeasoningAddErrorCode.INTERNAL_ERROR,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
      result_code: SeasoningAddErrorCode.INTERNAL_ERROR,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
