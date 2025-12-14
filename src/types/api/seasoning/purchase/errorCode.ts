import { ZodError, ZodIssue, ZodIssueCode } from "zod";

type FieldName =
  | "name"
  | "typeId"
  | "imageId"
  | "bestBeforeAt"
  | "expiresAt"
  | "purchasedAt";

/**
 * 購入調味料登録APIのエラーコード
 */
export type SeasoningPurchaseErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_TYPE_REQUIRED"
  | "VALIDATION_ERROR_IMAGE_ID_INVALID"
  | "VALIDATION_ERROR_PURCHASED_AT_REQUIRED"
  | "VALIDATION_ERROR_PURCHASED_AT_FUTURE"
  | "VALIDATION_ERROR_DATE_INVALID"
  | "SEASONING_TYPE_NOT_FOUND"
  | "SEASONING_IMAGE_NOT_FOUND"
  | "INTERNAL_ERROR";

const isFieldName = (
  path: (string | number)[],
  fieldName: FieldName
): boolean => path.includes(fieldName);

const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningPurchaseErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningPurchaseErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningPurchaseErrorCode.NAME_TOO_LONG;
    case "invalid_type":
    default:
      return SeasoningPurchaseErrorCode.NAME_REQUIRED;
  }
};

const typeIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningPurchaseErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
    default:
      return SeasoningPurchaseErrorCode.TYPE_REQUIRED;
  }
};

const imageIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningPurchaseErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
    default:
      return SeasoningPurchaseErrorCode.IMAGE_ID_INVALID;
  }
};

const purchasedAtFieldErrorCode = (
  issue: ZodIssue
): SeasoningPurchaseErrorCode => {
  if (issue.code === "custom") {
    return SeasoningPurchaseErrorCode.PURCHASED_AT_FUTURE;
  }

  switch (issue.code) {
    case "invalid_type":
    case "too_small":
      return SeasoningPurchaseErrorCode.PURCHASED_AT_REQUIRED;
    default:
      return SeasoningPurchaseErrorCode.DATE_INVALID;
  }
};

const dateFieldErrorCode = (): SeasoningPurchaseErrorCode => {
  return SeasoningPurchaseErrorCode.DATE_INVALID;
};

const issueToErrorCode = (issue: ZodIssue): SeasoningPurchaseErrorCode => {
  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "typeId")) {
    return typeIdFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "imageId")) {
    return imageIdFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "purchasedAt")) {
    return purchasedAtFieldErrorCode(issue);
  }

  if (
    isFieldName(issue.path, "bestBeforeAt") ||
    isFieldName(issue.path, "expiresAt")
  ) {
    return dateFieldErrorCode();
  }

  return SeasoningPurchaseErrorCode.DEFAULT;
};

/**
 * SeasoningPurchaseErrorCode のコンパニオンオブジェクト
 */
export const SeasoningPurchaseErrorCode = {
  fromValidationError: (zodError: ZodError): SeasoningPurchaseErrorCode => {
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningPurchaseErrorCode.DEFAULT;
    }
    return issueToErrorCode(zodError.issues[0]);
  },

  DEFAULT: "VALIDATION_ERROR_NAME_REQUIRED" as const,

  NAME_REQUIRED: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_TOO_LONG: "VALIDATION_ERROR_NAME_TOO_LONG" as const,
  TYPE_REQUIRED: "VALIDATION_ERROR_TYPE_REQUIRED" as const,
  IMAGE_ID_INVALID: "VALIDATION_ERROR_IMAGE_ID_INVALID" as const,
  PURCHASED_AT_REQUIRED: "VALIDATION_ERROR_PURCHASED_AT_REQUIRED" as const,
  PURCHASED_AT_FUTURE: "VALIDATION_ERROR_PURCHASED_AT_FUTURE" as const,
  DATE_INVALID: "VALIDATION_ERROR_DATE_INVALID" as const,
  SEASONING_TYPE_NOT_FOUND: "SEASONING_TYPE_NOT_FOUND" as const,
  SEASONING_IMAGE_NOT_FOUND: "SEASONING_IMAGE_NOT_FOUND" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;
