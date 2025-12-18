import { expect, test } from "vitest";

import { SEASONING_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { validateSeasoningName } from "@/utils/name-validation/name-validation";

const repeat = (char: string, length: number): string => char.repeat(length);

const cases: Array<{
  name: string;
  input: string;
  expected: ReturnType<typeof validateSeasoningName>;
}> = [
  {
    name: "空文字は REQUIRED",
    input: "",
    expected: "REQUIRED",
  },
  {
    name: "半角英数字のみは NONE",
    input: "salt123",
    expected: "NONE",
  },
  {
    name: "最大文字数超過は LENGTH_EXCEEDED",
    input: repeat("a", SEASONING_NAME_MAX_LENGTH + 1),
    expected: "LENGTH_EXCEEDED",
  },
  {
    name: "非英数字が含まれる場合は INVALID_FORMAT",
    input: "塩123",
    expected: "INVALID_FORMAT",
  },
  {
    name: "記号が含まれる場合も INVALID_FORMAT",
    input: "salt-123",
    expected: "INVALID_FORMAT",
  },
  {
    name: `最大文字数ちょうど（${SEASONING_NAME_MAX_LENGTH}文字）は NONE`,
    input: repeat("a", SEASONING_NAME_MAX_LENGTH),
    expected: "NONE",
  },
];

test.each(cases)("validateSeasoningName - %s", ({ input, expected }) => {
  expect(validateSeasoningName(input)).toBe(expected);
});
