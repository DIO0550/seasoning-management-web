import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { ConflictError, NotFoundError } from "@/domain/errors";
import type { DeleteSeasoningTypeInput } from "@/features/seasoning-types/usecases/delete-seasoning-type/dto";

const CONFLICT_MESSAGE = "関連データが存在するため削除できません";

export class DeleteSeasoningTypeUseCase {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(input: DeleteSeasoningTypeInput): Promise<void> {
    await this.unitOfWork.run(async (ctx) => {
      const seasoningTypeRepository = ctx.getSeasoningTypeRepository();
      const seasoningRepository = ctx.getSeasoningRepository();
      const seasoningTemplateRepository = ctx.getSeasoningTemplateRepository();

      const seasoningType = await seasoningTypeRepository.findById(
        input.typeId,
      );

      if (!seasoningType) {
        throw new NotFoundError("seasoning-type", input.typeId);
      }

      const [seasoningCount, templateCount] = await Promise.all([
        seasoningRepository.countByTypeId(input.typeId),
        seasoningTemplateRepository.countByTypeId(input.typeId),
      ]);

      if (seasoningCount > 0 || templateCount > 0) {
        throw new ConflictError(CONFLICT_MESSAGE);
      }

      try {
        const result = await seasoningTypeRepository.delete(input.typeId);

        if (result.affectedRows === 0) {
          throw new NotFoundError("seasoning-type", input.typeId);
        }
      } catch (error) {
        if (isForeignKeyConstraintError(error)) {
          throw new ConflictError(CONFLICT_MESSAGE);
        }

        throw error;
      }
    });
  }
}

const isForeignKeyConstraintError = (error: unknown): boolean => {
  const { code, errno, sqlState } = extractDatabaseErrorInfo(error);

  return (
    code === "ER_ROW_IS_REFERENCED_2" ||
    code === "ER_ROW_IS_REFERENCED" ||
    errno === 1451 ||
    sqlState === "23000"
  );
};

const extractDatabaseErrorInfo = (
  error: unknown,
): { code?: string; errno?: number; sqlState?: string } => {
  const record = toRecord(error);
  const context = toRecord(record?.context);
  const contextError = toRecord(context?.error);
  const source = contextError ?? record;

  return {
    code: toString(source?.code),
    errno: toNumber(source?.errno),
    sqlState: toString(source?.sqlState),
  };
};

const toRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

const toString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const toNumber = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined;
