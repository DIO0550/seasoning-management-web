import { expect, test } from "vitest";

import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";
import { validateSeasoningTypeName } from "@/utils/seasoning-type-name-validation/seasoning-type-name-validation";

const repeatChar = (length: number): string => "あ".repeat(length);

type Case = {
  name: string;
  input: string;
  expected: ReturnType<typeof validateSeasoningTypeName>;
};

const baseCases: Case[] = [
  {
    name: "空の文字列は REQUIRED",
    input: "",
    expected: "REQUIRED",
  },
  {
    name: "空白のみの文字列は REQUIRED",
    input: "   ",
    expected: "REQUIRED",
  },
  {
    name: "有効な調味料種類名は NONE",
    input: "香辛料",
    expected: "NONE",
  },
  {
    name: "最大文字数超過は LENGTH_EXCEEDED",
    input: repeatChar(SEASONING_TYPE_NAME_MAX_LENGTH + 1),
    expected: "LENGTH_EXCEEDED",
  },
  {
    name: `最大文字数ちょうど（${SEASONING_TYPE_NAME_MAX_LENGTH}文字）は NONE`,
    input: repeatChar(SEASONING_TYPE_NAME_MAX_LENGTH),
    expected: "NONE",
  },
];

test.each(baseCases)("validateSeasoningTypeName - %s", ({ input, expected }) => {
  expect(validateSeasoningTypeName(input)).toBe(expected);
});

test("前後の空白はトリムされてバリデーションされる", () => {
  expect(validateSeasoningTypeName("  香辛料  ")).toBe("NONE");
});

test(
  `前後の空白を含めて${SEASONING_TYPE_NAME_MAX_LENGTH}文字を超えても、trim後が上限以内なら NONE`,
  () => {
    const nameWithSpaces = `  ${repeatChar(SEASONING_TYPE_NAME_MAX_LENGTH)}  `;
    expect(validateSeasoningTypeName(nameWithSpaces)).toBe("NONE");
  }
);
