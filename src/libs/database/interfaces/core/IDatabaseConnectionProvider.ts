import type { IDatabaseConnection } from "./IDatabaseConnection";
import type { ConnectionConfig } from "./IDatabaseConnection";

/**
 * データベース接続プロバイダのインターフェース
 *
 * データベース接続の取得と管理を抽象化します。
 * ドメイン層は具体的な接続管理の実装に依存せず、
 * このインターフェースを通じて接続を取得します。
 *
 * @remarks
 * このインターフェースはクリーンアーキテクチャの依存性逆転の原則に従い、
 * ドメイン層に配置されています。具体的な実装はインフラ層で提供されます。
 */
export interface IDatabaseConnectionProvider {
  /**
   * データベース接続を取得する
   *
   * @returns データベース接続のインスタンス
   * @throws {ConnectionError} 接続の取得に失敗した場合
   */
  getConnection(): Promise<IDatabaseConnection>;

  /**
   * 接続を解放する
   *
   * プールモードの場合、接続をプールに返却します。
   * シングル接続モードの場合、何もしません。
   *
   * @param connection 解放する接続
   */
  releaseConnection(connection: IDatabaseConnection): Promise<void>;

  /**
   * プロバイダが初期化されているかどうかを確認する
   *
   * @returns 初期化済みの場合はtrue
   */
  isInitialized(): boolean;

  /**
   * 接続設定を取得する
   *
   * @returns 現在の接続設定
   */
  getConfig(): ConnectionConfig;

  /**
   * プロバイダを破棄する
   *
   * すべての接続を閉じ、リソースを解放します。
   */
  destroy(): Promise<void>;
}
