import { expect, test } from "vitest";
import {
  canSubmit,
  hasAllRequiredFields,
  hasAnyFormErrors,
  type FormErrors,
  type FormField,
} from "@/utils/form-validation/form-validation";

const buildField = (value: string, error = ""): FormField => ({
  value,
  error,
});

const buildErrors = (overrides: Partial<FormErrors> = {}): FormErrors => ({
  image: "",
  general: "",
  ...overrides,
});

const hasAllRequiredFieldsCases: Array<{
  name: string;
  fields: FormField[];
  expected: boolean;
}> = [
  {
    name: "hasAllRequiredFields - すべてのフィールドに値がある場合は true",
    fields: [buildField("salt"), buildField("seasoning")],
    expected: true,
  },
  {
    name: "hasAllRequiredFields - 一部のフィールドが空なら false",
    fields: [buildField(""), buildField("seasoning")],
    expected: false,
  },
  {
    name: "hasAllRequiredFields - 全フィールド空なら false",
    fields: [buildField(""), buildField("")],
    expected: false,
  },
  {
    name: "hasAllRequiredFields - フィールドが存在しない場合は true",
    fields: [],
    expected: true,
  },
];

test.each(hasAllRequiredFieldsCases)("%s", ({ fields, expected }) => {
  expect(hasAllRequiredFields(fields)).toBe(expected);
});

const hasAnyFormErrorsCases: Array<{
  name: string;
  fields: FormField[];
  errors: FormErrors;
  expected: boolean;
}> = [
  {
    name: "hasAnyFormErrors - フィールド・画像・一般エラーがすべて空なら false",
    fields: [buildField("salt"), buildField("seasoning")],
    errors: buildErrors(),
    expected: false,
  },
  {
    name: "hasAnyFormErrors - フィールドエラーがあれば true",
    fields: [buildField("salt", "名前エラー"), buildField("seasoning")],
    errors: buildErrors(),
    expected: true,
  },
  {
    name: "hasAnyFormErrors - 画像エラーがあれば true",
    fields: [buildField("salt"), buildField("seasoning")],
    errors: buildErrors({ image: "画像エラー" }),
    expected: true,
  },
  {
    name: "hasAnyFormErrors - 一般エラーがあれば true",
    fields: [buildField("salt"), buildField("seasoning")],
    errors: buildErrors({ general: "送信エラー" }),
    expected: true,
  },
];

test.each(hasAnyFormErrorsCases)("%s", ({ fields, errors, expected }) => {
  expect(hasAnyFormErrors(fields, errors)).toBe(expected);
});

const commonFields = {
  filled: [buildField("salt"), buildField("seasoning")],
  missing: [buildField(""), buildField("seasoning")],
};

const canSubmitCases: Array<{
  name: string;
  fields: FormField[];
  errors: FormErrors;
  expected: boolean;
}> = [
  {
    name: "canSubmit - 必須フィールドが埋まりエラーも無い場合は true",
    fields: commonFields.filled,
    errors: buildErrors(),
    expected: true,
  },
  {
    name: "canSubmit - 必須フィールドが空なら false",
    fields: commonFields.missing,
    errors: buildErrors(),
    expected: false,
  },
  {
    name: "canSubmit - フィールドエラーがあれば false",
    fields: [buildField("salt", "名前エラー"), buildField("seasoning")],
    errors: buildErrors(),
    expected: false,
  },
  {
    name: "canSubmit - エラーが無くてもフィールド不足なら false",
    fields: [buildField("salt"), buildField("")],
    errors: buildErrors(),
    expected: false,
  },
  {
    name: "canSubmit - フィールド不足と画像エラーが両方存在する場合も false",
    fields: [buildField("", "名前エラー"), buildField("")],
    errors: buildErrors({ image: "画像エラー" }),
    expected: false,
  },
];

test.each(canSubmitCases)("%s", ({ fields, errors, expected }) => {
  expect(canSubmit(fields, errors)).toBe(expected);
});
