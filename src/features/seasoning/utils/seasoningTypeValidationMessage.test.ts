import { describe, test, expect } from "vitest";
import {
  getSeasoningTypeValidationMessage,
  getSeasoningTypeSubmitMessage,
} from "./seasoningTypeValidationMessage";
import {
  VALIDATION_ERROR_STATES,
  type ValidationErrorState,
} from "../../../types/validationErrorState";
import { SUBMIT_ERROR_STATES } from "../../../types/submitErrorState";

describe("getSeasoningTypeValidationMessage", () => {
  test("REQUIREDエラーの場合、必須メッセージを返す", () => {
    const result = getSeasoningTypeValidationMessage(
      VALIDATION_ERROR_STATES.REQUIRED
    );
    expect(result).toBe("調味料の種類名は必須です");
  });

  test("TOO_LONGエラーの場合、文字数制限メッセージを返す", () => {
    const result = getSeasoningTypeValidationMessage(
      VALIDATION_ERROR_STATES.TOO_LONG
    );
    expect(result).toBe("調味料の種類名は50文字以内で入力してください");
  });

  test("NONEエラーの場合、空文字を返す", () => {
    const result = getSeasoningTypeValidationMessage(
      VALIDATION_ERROR_STATES.NONE
    );
    expect(result).toBe("");
  });

  test("未定義のエラーの場合、空文字を返す", () => {
    // 不正な値をValidationErrorStateとして扱う
    const invalidError = "INVALID_FORMAT" as unknown as ValidationErrorState;
    const result = getSeasoningTypeValidationMessage(invalidError);
    expect(result).toBe("");
  });
});

describe("getSeasoningTypeSubmitMessage", () => {
  test("NETWORK_ERRORの場合、ネットワークエラーメッセージを返す", () => {
    const result = getSeasoningTypeSubmitMessage(
      SUBMIT_ERROR_STATES.NETWORK_ERROR
    );
    expect(result).toBe(
      "通信エラーが発生しました。しばらくしてから再度お試しください"
    );
  });

  test("VALIDATION_ERRORの場合、バリデーションエラーメッセージを返す", () => {
    const result = getSeasoningTypeSubmitMessage(
      SUBMIT_ERROR_STATES.VALIDATION_ERROR
    );
    expect(result).toBe("入力内容を確認してください");
  });

  test("SERVER_ERRORの場合、サーバーエラーメッセージを返す", () => {
    const result = getSeasoningTypeSubmitMessage(
      SUBMIT_ERROR_STATES.SERVER_ERROR
    );
    expect(result).toBe(
      "システムエラーが発生しました。管理者にお問い合わせください"
    );
  });

  test("UNKNOWN_ERRORの場合、一般的なエラーメッセージを返す", () => {
    const result = getSeasoningTypeSubmitMessage(
      SUBMIT_ERROR_STATES.UNKNOWN_ERROR
    );
    expect(result).toBe("調味料の種類の追加に失敗しました");
  });

  test("NONEの場合、空文字を返す", () => {
    const result = getSeasoningTypeSubmitMessage(SUBMIT_ERROR_STATES.NONE);
    expect(result).toBe("");
  });
});
