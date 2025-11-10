import { expect, test } from "vitest";

import { TEMPLATE_DESCRIPTION_MAX_LENGTH } from "@/constants/validation/descriptionValidation";
import { validateTemplateDescription } from "@/utils/template-description-validation/template-description-validation";

const chars = (count: number): string => "あ".repeat(count);

const cases: Array<{ name: string; input: string; expected: boolean }> = [
  {
    name: "空文字は true（任意項目）",
    input: "",
    expected: true,
  },
  {
    name: `${TEMPLATE_DESCRIPTION_MAX_LENGTH}文字以内は true`,
    input: chars(TEMPLATE_DESCRIPTION_MAX_LENGTH),
    expected: true,
  },
  {
    name: `${TEMPLATE_DESCRIPTION_MAX_LENGTH + 1}文字以上は false`,
    input: chars(TEMPLATE_DESCRIPTION_MAX_LENGTH + 1),
    expected: false,
  },
  {
    name: "有効な説明文は true",
    input: "朝食に使う調味料のテンプレートです。",
    expected: true,
  },
];

test.each(cases)("validateTemplateDescription - %s", ({ input, expected }) => {
  expect(validateTemplateDescription(input)).toBe(expected);
});
