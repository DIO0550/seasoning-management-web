import { NextRequest, NextResponse } from "next/server";
import type {
  SeasoningTemplateListResponse,
  ErrorResponse as ApiErrorResponse,
} from "@/types/api/seasoning-template/list/types";
import { seasoningTemplateListQuerySchema } from "@/types/api/seasoning-template/list/schemas";
import { SeasoningTemplateListErrorCode } from "@/types/api/seasoning-template/list/error-code";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { ListSeasoningTemplatesUseCase } from "@/features/seasoning-templates/usecases/list-seasoning-templates";
import { errorMapper } from "@/utils/api/error-mapper";

/**
 * GET /api/seasoning-templates - 調味料テンプレート一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    const validationResult =
      seasoningTemplateListQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errorCode = SeasoningTemplateListErrorCode.fromValidationError(
        validationResult.error,
      );

      const errorResponse: ApiErrorResponse = {
        code: errorCode,
        message: "入力内容を確認してください",
        details: validationResult.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningTemplateRepository =
      await repositoryFactory.createSeasoningTemplateRepository();

    const output = await ListSeasoningTemplatesUseCase.execute(
      seasoningTemplateRepository,
      validationResult.data,
    );

    const response: SeasoningTemplateListResponse = {
      data: output.data,
      meta: output.meta,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("調味料テンプレート一覧取得エラー:", error);
    } else {
      console.error("調味料テンプレート一覧取得エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }

    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
