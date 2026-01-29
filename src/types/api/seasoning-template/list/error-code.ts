import { ZodError, ZodIssue, ZodIssueCode } from "zod";

type FieldName = "page" | "pageSize" | "search";

export type SeasoningTemplateListErrorCode =
  | "VALIDATION_ERROR_PAGE_INVALID"
  | "VALIDATION_ERROR_PAGE_TOO_SMALL"
  | "VALIDATION_ERROR_PAGE_SIZE_INVALID"
  | "VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL"
  | "VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE"
  | "VALIDATION_ERROR_SEARCH_TOO_LONG"
  | "INTERNAL_ERROR";

export const SeasoningTemplateListErrorCode = {
  fromValidationError: (zodError: ZodError): SeasoningTemplateListErrorCode => {
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningTemplateListErrorCode.DEFAULT;
    }

    return issueToErrorCode(zodError.issues[0]);
  },

  DEFAULT: "VALIDATION_ERROR_PAGE_INVALID" as const,
  PAGE_INVALID: "VALIDATION_ERROR_PAGE_INVALID" as const,
  PAGE_TOO_SMALL: "VALIDATION_ERROR_PAGE_TOO_SMALL" as const,
  PAGE_SIZE_INVALID: "VALIDATION_ERROR_PAGE_SIZE_INVALID" as const,
  PAGE_SIZE_TOO_SMALL: "VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL" as const,
  PAGE_SIZE_TOO_LARGE: "VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE" as const,
  SEARCH_TOO_LONG: "VALIDATION_ERROR_SEARCH_TOO_LONG" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

const pageFieldErrorCode = (
  zodErrorCode: ZodIssueCode,
): SeasoningTemplateListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningTemplateListErrorCode.PAGE_INVALID;
    case "too_small":
      return SeasoningTemplateListErrorCode.PAGE_TOO_SMALL;
    default:
      return SeasoningTemplateListErrorCode.PAGE_INVALID;
  }
};

const pageSizeFieldErrorCode = (
  zodErrorCode: ZodIssueCode,
): SeasoningTemplateListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningTemplateListErrorCode.PAGE_SIZE_INVALID;
    case "too_small":
      return SeasoningTemplateListErrorCode.PAGE_SIZE_TOO_SMALL;
    case "too_big":
      return SeasoningTemplateListErrorCode.PAGE_SIZE_TOO_LARGE;
    default:
      return SeasoningTemplateListErrorCode.PAGE_SIZE_INVALID;
  }
};

const searchFieldErrorCode = (
  zodErrorCode: ZodIssueCode,
): SeasoningTemplateListErrorCode => {
  switch (zodErrorCode) {
    case "too_big":
      return SeasoningTemplateListErrorCode.SEARCH_TOO_LONG;
    default:
      return SeasoningTemplateListErrorCode.SEARCH_TOO_LONG;
  }
};

const isFieldName = (
  path: (string | number)[],
  fieldName: FieldName,
): boolean => {
  return path.includes(fieldName);
};

const issueToErrorCode = (issue: ZodIssue): SeasoningTemplateListErrorCode => {
  if (isFieldName(issue.path, "page")) {
    return pageFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "pageSize")) {
    return pageSizeFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "search")) {
    return searchFieldErrorCode(issue.code);
  }

  return SeasoningTemplateListErrorCode.DEFAULT;
};
