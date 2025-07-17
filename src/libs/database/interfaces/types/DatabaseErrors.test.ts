import { describe, test, expect } from 'vitest';
import { 
  DatabaseError, 
  ConnectionError, 
  TransactionError, 
  QueryError,
  isDatabaseError,
  isConnectionError,
  isTransactionError,
  isQueryError
} from './DatabaseErrors';

describe('DatabaseErrors', () => {
  describe('DatabaseError', () => {
    test('基本的なエラー情報を持つ', () => {
      const error = new DatabaseError('テストエラー', 'TEST_ERROR');
      
      expect(error.message).toBe('テストエラー');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('DatabaseError');
      expect(error).toBeInstanceOf(Error);
    });

    test('原因エラーを持つことができる', () => {
      const cause = new Error('原因エラー');
      const error = new DatabaseError('テストエラー', 'TEST_ERROR', cause);
      
      expect(error.cause).toBe(cause);
    });
  });

  describe('ConnectionError', () => {
    test('接続エラーを表現する', () => {
      const error = new ConnectionError('接続に失敗しました', 'CONNECTION_FAILED');
      
      expect(error.message).toBe('接続に失敗しました');
      expect(error.code).toBe('CONNECTION_FAILED');
      expect(error.name).toBe('ConnectionError');
      expect(error).toBeInstanceOf(DatabaseError);
    });
  });

  describe('TransactionError', () => {
    test('トランザクションエラーを表現する', () => {
      const error = new TransactionError('トランザクション開始に失敗しました', 'TRANSACTION_BEGIN_FAILED');
      
      expect(error.message).toBe('トランザクション開始に失敗しました');
      expect(error.code).toBe('TRANSACTION_BEGIN_FAILED');
      expect(error.name).toBe('TransactionError');
      expect(error).toBeInstanceOf(DatabaseError);
    });
  });

  describe('QueryError', () => {
    test('クエリエラーを表現する', () => {
      const sql = 'SELECT * FROM users';
      const error = new QueryError('SQLエラーが発生しました', 'SQL_SYNTAX_ERROR', undefined, sql);
      
      expect(error.message).toBe('SQLエラーが発生しました');
      expect(error.code).toBe('SQL_SYNTAX_ERROR');
      expect(error.name).toBe('QueryError');
      expect(error.sql).toBe(sql);
      expect(error).toBeInstanceOf(DatabaseError);
    });
  });

  describe('型ガード関数', () => {
    test('isDatabaseError は DatabaseError インスタンスを正しく判定する', () => {
      const dbError = new DatabaseError('テスト', 'TEST');
      const normalError = new Error('通常エラー');
      
      expect(isDatabaseError(dbError)).toBe(true);
      expect(isDatabaseError(normalError)).toBe(false);
    });

    test('isConnectionError は ConnectionError インスタンスを正しく判定する', () => {
      const connError = new ConnectionError('接続エラー', 'CONN_ERROR');
      const dbError = new DatabaseError('テスト', 'TEST');
      
      expect(isConnectionError(connError)).toBe(true);
      expect(isConnectionError(dbError)).toBe(false);
    });

    test('isTransactionError は TransactionError インスタンスを正しく判定する', () => {
      const txError = new TransactionError('トランザクションエラー', 'TX_ERROR');
      const dbError = new DatabaseError('テスト', 'TEST');
      
      expect(isTransactionError(txError)).toBe(true);
      expect(isTransactionError(dbError)).toBe(false);
    });

    test('isQueryError は QueryError インスタンスを正しく判定する', () => {
      const queryError = new QueryError('クエリエラー', 'QUERY_ERROR');
      const dbError = new DatabaseError('テスト', 'TEST');
      
      expect(isQueryError(queryError)).toBe(true);
      expect(isQueryError(dbError)).toBe(false);
    });
  });
});
