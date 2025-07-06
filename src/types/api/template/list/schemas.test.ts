import { describe, test, expect } from 'vitest';
import { 
  templateListResponseSchema,
  templateListQuerySchema 
} from './schemas';

describe('Template List API Schemas', () => {
  describe('templateListQuerySchema', () => {
    test('有効なクエリパラメータを受け入れる', () => {
      const validQuery = {
        page: 1,
        limit: 20,
        search: null
      };

      expect(() => templateListQuerySchema.parse(validQuery)).not.toThrow();
    });

    test('検索条件ありのクエリパラメータを受け入れる', () => {
      const validQuery = {
        page: 2,
        limit: 10,
        search: '和食'
      };

      expect(() => templateListQuerySchema.parse(validQuery)).not.toThrow();
    });

    test('pageが0以下の場合にバリデーションエラーになる', () => {
      const invalidQuery = {
        page: 0,
        limit: 20,
        search: null
      };

      expect(() => templateListQuerySchema.parse(invalidQuery)).toThrow();
    });

    test('limitが0以下の場合にバリデーションエラーになる', () => {
      const invalidQuery = {
        page: 1,
        limit: 0,
        search: null
      };

      expect(() => templateListQuerySchema.parse(invalidQuery)).toThrow();
    });

    test('limitが100を超える場合にバリデーションエラーになる', () => {
      const invalidQuery = {
        page: 1,
        limit: 101,
        search: null
      };

      expect(() => templateListQuerySchema.parse(invalidQuery)).toThrow();
    });
  });

  describe('templateListResponseSchema', () => {
    test('有効なテンプレート一覧レスポンスを受け入れる', () => {
      const validResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: '和食の基本',
              description: '和食に必要な基本的な調味料セット',
              seasoningCount: 3,
              seasonings: [
                {
                  id: 1,
                  name: '醤油',
                  seasoningTypeId: 1,
                  seasoningTypeName: '液体調味料',
                  imageUrl: null
                },
                {
                  id: 2,
                  name: '味噌',
                  seasoningTypeId: 2,
                  seasoningTypeName: '発酵調味料',
                  imageUrl: null
                }
              ],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1
          }
        }
      };

      expect(() => templateListResponseSchema.parse(validResponse)).not.toThrow();
    });

    test('空の一覧レスポンスを受け入れる', () => {
      const validResponse = {
        success: true,
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      };

      expect(() => templateListResponseSchema.parse(validResponse)).not.toThrow();
    });

    test('descriptionがnullのテンプレートを受け入れる', () => {
      const validResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: '和食の基本',
              description: null,
              seasoningCount: 2,
              seasonings: [
                {
                  id: 1,
                  name: '醤油',
                  seasoningTypeId: 1,
                  seasoningTypeName: '液体調味料',
                  imageUrl: null
                }
              ],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1
          }
        }
      };

      expect(() => templateListResponseSchema.parse(validResponse)).not.toThrow();
    });

    test('successがfalseの場合にバリデーションエラーになる', () => {
      const invalidResponse = {
        success: false,
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      };

      expect(() => templateListResponseSchema.parse(invalidResponse)).toThrow();
    });
  });
});
