import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { SeasoningPurchaseErrorCode } from "@/types/api/seasoning/purchase/errorCode";

describe("SeasoningPurchaseErrorCode", () => {
  describe("fromValidationError", () => {
    it("nameフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_NAME_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料名は必須です",
          path: ["name"],
        },
      ]);

      const result = SeasoningPurchaseErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
    });

    it("nameフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_NAME_TOO_LONGを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 100,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料名は100文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningPurchaseErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("typeIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "undefined",
          message: "調味料の種類を選択してください",
          path: ["typeId"],
        },
      ]);

      const result = SeasoningPurchaseErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("purchasedAtフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_PURCHASED_AT_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "undefined",
          message: "購入日は必須です",
          path: ["purchasedAt"],
        },
      ]);

      const result = SeasoningPurchaseErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PURCHASED_AT_REQUIRED");
    });

    it("purchasedAtフィールドのcustomエラーの場合、VALIDATION_ERROR_PURCHASED_AT_FUTUREを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "購入日は未来の日付にできません",
          path: ["purchasedAt"],
        },
      ]);

      const result = SeasoningPurchaseErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PURCHASED_AT_FUTURE");
    });
  });

  it("デフォルトエラーコードが正しく設定されている", () => {
    expect(SeasoningPurchaseErrorCode.DEFAULT).toBe(
      "VALIDATION_ERROR_NAME_REQUIRED"
    );
  });
});
