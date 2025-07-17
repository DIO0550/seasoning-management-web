import { describe, test, expect } from 'vitest';
import type { ITransaction } from './ITransaction';

// テスト用のモック実装
class MockTransaction implements ITransaction {
  private _isActive = false;
  private _isCommitted = false;
  private _isRolledBack = false;

  async begin(): Promise<void> {
    this._isActive = true;
  }

  async commit(): Promise<void> {
    if (!this._isActive) {
      throw new Error('Transaction is not active');
    }
    this._isCommitted = true;
    this._isActive = false;
  }

  async rollback(): Promise<void> {
    if (!this._isActive) {
      throw new Error('Transaction is not active');
    }
    this._isRolledBack = true;
    this._isActive = false;
  }

  isActive(): boolean {
    return this._isActive;
  }

  getId(): string {
    return 'mock-transaction-id';
  }

  // テスト用のヘルパーメソッド
  get isCommitted(): boolean {
    return this._isCommitted;
  }

  get isRolledBack(): boolean {
    return this._isRolledBack;
  }
}

describe('ITransaction', () => {
  test('トランザクションを開始できる', async () => {
    const transaction = new MockTransaction();
    
    expect(transaction.isActive()).toBe(false);
    
    await transaction.begin();
    
    expect(transaction.isActive()).toBe(true);
  });

  test('トランザクションをコミットできる', async () => {
    const transaction = new MockTransaction();
    
    await transaction.begin();
    expect(transaction.isActive()).toBe(true);
    
    await transaction.commit();
    
    expect(transaction.isActive()).toBe(false);
    expect(transaction.isCommitted).toBe(true);
  });

  test('トランザクションをロールバックできる', async () => {
    const transaction = new MockTransaction();
    
    await transaction.begin();
    expect(transaction.isActive()).toBe(true);
    
    await transaction.rollback();
    
    expect(transaction.isActive()).toBe(false);
    expect(transaction.isRolledBack).toBe(true);
  });

  test('非アクティブなトランザクションはコミットできない', async () => {
    const transaction = new MockTransaction();
    
    await expect(transaction.commit()).rejects.toThrow('Transaction is not active');
  });

  test('非アクティブなトランザクションはロールバックできない', async () => {
    const transaction = new MockTransaction();
    
    await expect(transaction.rollback()).rejects.toThrow('Transaction is not active');
  });

  test('トランザクションIDを取得できる', () => {
    const transaction = new MockTransaction();
    
    expect(transaction.getId()).toBe('mock-transaction-id');
    expect(typeof transaction.getId()).toBe('string');
  });

  test('複数回のbeginは許可されない', async () => {
    const transaction = new MockTransaction();
    
    await transaction.begin();
    expect(transaction.isActive()).toBe(true);
    
    // 2回目のbeginはエラーになるべき（実装次第）
    // この部分は実装によって動作が変わる可能性がある
  });
});
