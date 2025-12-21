import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import type { RequestInit as NextRequestInit } from "next/dist/server/web/spec-extension/request";
import { POST } from "@/app/api/seasonings/purchases/route";
import { NotFoundError } from "@/domain/errors";
import type {
  ISeasoningImageRepository,
  ISeasoningRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";

const registerPurchaseExecuteMock = vi.fn();

vi.mock("@/features/seasonings/usecases/register-purchase", () => ({
  RegisterPurchaseUseCase: vi.fn().mockImplementation(() => ({
    execute: registerPurchaseExecuteMock,
  })),
}));

vi.mock("@/infrastructure/database/connection-manager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({
      getConnection: vi.fn(),
    })),
  },
}));

const mockSeasoningRepository = {} as unknown as ISeasoningRepository;
const mockSeasoningTypeRepository = {} as unknown as ISeasoningTypeRepository;
const mockSeasoningImageRepository = {} as unknown as ISeasoningImageRepository;

vi.mock("@/infrastructure/di/repository-factory", () => ({
  RepositoryFactory: vi.fn().mockImplementation(() => ({
    createSeasoningRepository: vi.fn(async () => mockSeasoningRepository),
    createSeasoningTypeRepository: vi.fn(
      async () => mockSeasoningTypeRepository
    ),
    createSeasoningImageRepository: vi.fn(
      async () => mockSeasoningImageRepository
    ),
  })),
}));

const createRequest = ({
  method = "POST",
  body,
}: {
  method?: string;
  body?: Record<string, unknown>;
} = {}): NextRequest => {
  const url = new URL("http://localhost:3000/api/seasonings/purchases");

  const init: NextRequestInit = {
    method,
  };

  if (body) {
    init.headers = {
      "Content-Type": "application/json",
    };
    init.body = JSON.stringify(body);
  }

  return new NextRequest(url, init);
};

beforeEach(() => {
  vi.clearAllMocks();
  registerPurchaseExecuteMock.mockReset();
});

test("POST /api/seasonings/purchases - 正常に作成できる", async () => {
  const detail = {
    id: 10,
    name: "醤油",
    typeId: 2,
    typeName: "液体調味料",
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: "2025-11-01",
    createdAt: "2025-11-15T00:00:00.000Z",
    updatedAt: "2025-11-15T00:00:00.000Z",
  };

  registerPurchaseExecuteMock.mockResolvedValue(detail);

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 2,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(201);
  await expect(response.json()).resolves.toEqual({ data: detail });
  expect(registerPurchaseExecuteMock).toHaveBeenCalledWith({
    name: "醤油",
    typeId: 2,
    purchasedAt: "2025-11-01",
  });
});

test("POST /api/seasonings/purchases - purchasedAt 未指定は400", async () => {
  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 2,
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_PURCHASED_AT_REQUIRED");
});

test("POST /api/seasonings/purchases - purchasedAt が未来日は400", async () => {
  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 2,
        purchasedAt: "2999-01-01",
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_PURCHASED_AT_FUTURE");
});

test("POST /api/seasonings/purchases - name が100文字ちょうどなら201", async () => {
  const name = "あ".repeat(100);
  const detail = {
    id: 10,
    name,
    typeId: 2,
    typeName: "液体調味料",
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: "2025-11-01",
    createdAt: "2025-11-15T00:00:00.000Z",
    updatedAt: "2025-11-15T00:00:00.000Z",
  };

  registerPurchaseExecuteMock.mockResolvedValue(detail);

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name,
        typeId: 2,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(201);
  await expect(response.json()).resolves.toEqual({ data: detail });
  expect(registerPurchaseExecuteMock).toHaveBeenCalledWith({
    name,
    typeId: 2,
    purchasedAt: "2025-11-01",
  });
});

test("POST /api/seasonings/purchases - name が101文字以上は400", async () => {
  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "あ".repeat(101),
        typeId: 2,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
});

test("POST /api/seasonings/purchases - SeasoningType が存在しない場合は404", async () => {
  registerPurchaseExecuteMock.mockRejectedValue(
    new NotFoundError("seasoning-type", 999)
  );

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 999,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(404);
  const payload = await response.json();
  expect(payload.code).toBe("SEASONING_TYPE_NOT_FOUND");
});

test("POST /api/seasonings/purchases - SeasoningImage が存在しない場合は404", async () => {
  registerPurchaseExecuteMock.mockRejectedValue(
    new NotFoundError("seasoning-image", 55)
  );

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 1,
        imageId: 55,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(404);
  const payload = await response.json();
  expect(payload.code).toBe("SEASONING_IMAGE_NOT_FOUND");
});

test("POST /api/seasonings/purchases - リクエストボディが不正なJSONの場合は400", async () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  const url = new URL("http://localhost:3000/api/seasonings/purchases");
  const request = new NextRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{invalid-json",
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("INTERNAL_ERROR");

  consoleErrorSpy.mockRestore();
});

test("POST /api/seasonings/purchases - 無効な日付エラーの場合は400", async () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  registerPurchaseExecuteMock.mockRejectedValueOnce(new Error("Invalid date"));

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 2,
        purchasedAt: "2025-11-01",
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_DATE_INVALID");

  consoleErrorSpy.mockRestore();
});
