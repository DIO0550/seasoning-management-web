import { ZodError, ZodIssue, ZodIssueCode } from "zod";

type FieldName =
  | "name"
  | "typeId"
  | "imageId"
  | "bestBeforeAt"
  | "expiresAt"
  | "purchasedAt";

/**
 * 調味料追加APIのエラーコード
 */
export type SeasoningAddErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_TYPE_REQUIRED"
  | "VALIDATION_ERROR_IMAGE_ID_INVALID"
  | "VALIDATION_ERROR_DATE_INVALID"
  | "DUPLICATE_NAME"
  | "SEASONING_TYPE_NOT_FOUND"
  | "SEASONING_IMAGE_NOT_FOUND"
  | "INTERNAL_ERROR";

export const SeasoningAddErrorCode = {
  fromValidationError: (zodError: ZodError): SeasoningAddErrorCode => {
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningAddErrorCode.DEFAULT;
    }

    return issueToErrorCode(zodError.issues[0]);
  },
  DEFAULT: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_REQUIRED: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_TOO_LONG: "VALIDATION_ERROR_NAME_TOO_LONG" as const,
  TYPE_REQUIRED: "VALIDATION_ERROR_TYPE_REQUIRED" as const,
  IMAGE_ID_INVALID: "VALIDATION_ERROR_IMAGE_ID_INVALID" as const,
  DATE_INVALID: "VALIDATION_ERROR_DATE_INVALID" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  SEASONING_TYPE_NOT_FOUND: "SEASONING_TYPE_NOT_FOUND" as const,
  SEASONING_IMAGE_NOT_FOUND: "SEASONING_IMAGE_NOT_FOUND" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningAddErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningAddErrorCode.NAME_TOO_LONG;
    default:
      return SeasoningAddErrorCode.NAME_REQUIRED;
  }
};

const typeIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningAddErrorCode.TYPE_REQUIRED;
    default:
      return SeasoningAddErrorCode.TYPE_REQUIRED;
  }
};

const imageIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningAddErrorCode.IMAGE_ID_INVALID;
    default:
      return SeasoningAddErrorCode.IMAGE_ID_INVALID;
  }
};

const dateFieldErrorCode = (): SeasoningAddErrorCode => {
  return SeasoningAddErrorCode.DATE_INVALID;
};

const isFieldName = (
  path: (string | number)[],
  fieldName: FieldName
): boolean => path.includes(fieldName);

const issueToErrorCode = (issue: ZodIssue): SeasoningAddErrorCode => {
  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "typeId")) {
    return typeIdFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "imageId")) {
    return imageIdFieldErrorCode(issue.code);
  }

  if (
    isFieldName(issue.path, "bestBeforeAt") ||
    isFieldName(issue.path, "expiresAt") ||
    isFieldName(issue.path, "purchasedAt")
  ) {
    return dateFieldErrorCode();
  }

  return SeasoningAddErrorCode.DEFAULT;
};
