/**
 * @fileoverview 個別リポジトリ生成関数のテスト
 * 各リポジトリ生成関数の動作確認
 */

import { describe, it, expect, vi } from "vitest";
import type { IDatabaseConnection } from "@/libs/database/interfaces";
import {
  createSeasoningRepository,
  createSeasoningTypeRepository,
  createSeasoningImageRepository,
  createSeasoningTemplateRepository,
} from "./index";

// モックコネクション
const mockConnection: IDatabaseConnection = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(),
  query: vi.fn(),
  beginTransaction: vi.fn(),
  ping: vi.fn(),
  getConfig: vi.fn(),
};

describe("Repository Factory Functions", () => {
  describe("createSeasoningRepository", () => {
    it("should create SeasoningRepository instance", () => {
      const repository = createSeasoningRepository(mockConnection);
      expect(repository).toBeDefined();
      expect(typeof repository.create).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
    });
  });

  describe("createSeasoningTypeRepository", () => {
    it("should create SeasoningTypeRepository instance", () => {
      const repository = createSeasoningTypeRepository(mockConnection);
      expect(repository).toBeDefined();
      expect(typeof repository.create).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
    });
  });

  describe("createSeasoningImageRepository", () => {
    it("should create SeasoningImageRepository instance", () => {
      const repository = createSeasoningImageRepository(mockConnection);
      expect(repository).toBeDefined();
      expect(typeof repository.create).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
    });
  });

  describe("createSeasoningTemplateRepository", () => {
    it("should create SeasoningTemplateRepository instance", () => {
      const repository = createSeasoningTemplateRepository(mockConnection);
      expect(repository).toBeDefined();
      expect(typeof repository.create).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
    });
  });
});
