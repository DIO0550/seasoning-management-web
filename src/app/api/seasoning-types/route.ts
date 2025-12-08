import { NextRequest, NextResponse } from "next/server";
import { seasoningTypeAddRequestSchema } from "@/types/api/seasoningType/add/schemas";
import { seasoningTypeListResponseSchema } from "@/types/api/seasoningType/list/schemas";
import { SeasoningTypeAddErrorCode } from "@/types/api/seasoningType/add/errorCode";
import { ConnectionManager } from "@/infrastructure/database/ConnectionManager";
import { RepositoryFactory } from "@/infrastructure/di/RepositoryFactory";
import { errorMapper } from "@/utils/api/error-mapper";
import { DuplicateError } from "@/domain/errors";
import { ConflictError } from "@/libs/database/errors";

/**
 * GET /api/seasoning-types
 * 調味料種類の一覧を取得する
 */
export async function GET() {
  try {
    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningTypeRepository =
      await repositoryFactory.createSeasoningTypeRepository();

    const result = await seasoningTypeRepository.findAll();

    const response = {
      data: result.items.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };

    // スキーマで最終確認（実装ミス防止用）
    const parsed = seasoningTypeListResponseSchema.parse(response);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * POST /api/seasoning-types
 * 調味料種類を追加する
 */
export async function POST(request: NextRequest) {
  let requestedName: string | undefined;
  try {
    const body = await request.json();
    const validationResult = seasoningTypeAddRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorCode = SeasoningTypeAddErrorCode.fromValidationError(
        validationResult.error
      );

      return NextResponse.json(
        {
          code: errorCode,
          message: "入力内容を確認してください",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    requestedName = validationResult.data.name;

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningTypeRepository =
      await repositoryFactory.createSeasoningTypeRepository();

    // UX向上のための事前重複チェック。UNIQUE制約で最終的な整合性は保証される。
    const isDuplicate = await seasoningTypeRepository.existsByName(
      validationResult.data.name
    );
    if (isDuplicate) {
      throw new DuplicateError("name", validationResult.data.name);
    }

    const createResult = await seasoningTypeRepository.create({
      name: validationResult.data.name,
    });

    const created = await seasoningTypeRepository.findById(createResult.id);

    if (!created) {
      return NextResponse.json(
        {
          code: SeasoningTypeAddErrorCode.INTERNAL_ERROR,
          message: "作成した調味料の種類が取得できませんでした",
        },
        { status: 500 }
      );
    }

    const response = {
      data: {
        id: created.id,
        name: created.name,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ConflictError) {
      const contextValue =
        (error.context as { value?: unknown } | undefined)?.value;
      const duplicateValue =
        typeof contextValue === "string"
          ? contextValue
          : requestedName ?? "unknown";
      const duplicateError = new DuplicateError(
        "name",
        duplicateValue
      );
      const { status, body } = errorMapper.toHttpResponse(duplicateError);
      return NextResponse.json(body, { status });
    }

    // ConflictError以外のドメインエラーは共通マッパーに委譲
    const { status, body } = errorMapper.toHttpResponse(error);

    return NextResponse.json(body, { status });
  }
}
