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

vi.mock("@/infrastructure/database/ConnectionManager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({
      getConnection: vi.fn(),
    })),
  },
}));

const mockSeasoningRepository = {} as unknown as ISeasoningRepository;
const mockSeasoningTypeRepository = {} as unknown as ISeasoningTypeRepository;
const mockSeasoningImageRepository = {} as unknown as ISeasoningImageRepository;

vi.mock("@/infrastructure/di/RepositoryFactory", () => ({
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

test("POST /api/seasonings/purchases - SeasoningType が存在しない場合は404", async () => {
  registerPurchaseExecuteMock.mockRejectedValue(
    new NotFoundError("SeasoningType", 999)
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
    new NotFoundError("SeasoningImage", 55)
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
