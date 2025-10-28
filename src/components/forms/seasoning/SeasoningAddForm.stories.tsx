import type { Meta, StoryObj } from "@storybook/react";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { FormData } from "@/hooks/useSeasoningSubmit";
import {
  STORYBOOK_DELAY_SHORT,
  STORYBOOK_DELAY_MEDIUM,
} from "@/constants/ui";

const meta: Meta<typeof SeasoningAddForm> = {
  component: SeasoningAddForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">調味料追加</h2>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SeasoningAddForm>;

/**
 * デフォルトの調味料追加フォーム
 * 通常の状態で表示されるフォーム
 */
export const Default: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Quick validation and submit:", data);
      // 素早い処理をシミュレート
      await new Promise((resolve) =>
        setTimeout(resolve, STORYBOOK_DELAY_SHORT)
      );
    },
  },
};

/**
 * 送信成功のシナリオ
 * フォームが正常に送信される場合
 */
export const SuccessSubmission: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Form submitted with success:", data);
      // 成功時の処理をシミュレート
      await new Promise((resolve) =>
        setTimeout(resolve, STORYBOOK_DELAY_MEDIUM)
      );
      alert("調味料が正常に追加されました！");
    },
  },
};

/**
 * 重複エラーのシナリオ
 * 同じ名前の調味料が既に存在する場合
 */
export const DuplicateError: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Checking for duplicate:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 特定の名前で重複エラーをシミュレート
      if (data.name === "塩" || data.name === "salt") {
        throw new Error("この調味料名は既に登録されています");
      }

      console.log("Form submitted successfully:", data);
    },
  },
};

/**
 * ネットワークエラーのシナリオ
 * サーバーとの通信に失敗する場合
 */
export const NetworkError: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Attempting to submit:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ネットワークエラーをシミュレート
      throw new Error(
        "ネットワークエラーが発生しました。しばらく時間をおいてから再度お試しください。"
      );
    },
  },
};

/**
 * 送信処理なしのシナリオ
 * onSubmit が設定されていない場合（開発時など）
 */
export const WithoutSubmitHandler: Story = {
  args: {
    // onSubmit を設定しない
  },
};

/**
 * 長時間の送信処理のシナリオ
 * 送信に時間がかかる場合のローディング状態を確認
 */
export const LongSubmission: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Starting long submission:", data);
      // 長時間の送信処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Long submission completed:", data);
    },
  },
};

/**
 * バリデーションエラーのシナリオ
 * フォームのバリデーションエラーを確認する場合
 *
 * 注意: このストーリーは手動でフォームに無効な値を入力して
 * バリデーションエラーの表示を確認するために使用してください
 */
export const ValidationErrors: Story = {
  args: {
    onSubmit: async (data: FormData) => {
      console.log("Form validation test:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // バリデーションが通った場合の成功メッセージ
      alert("バリデーションが正常に通りました！");
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
このストーリーでは、フォームのバリデーション機能を確認できます。
以下の操作を試してみてください：

- 調味料名を空白にしてフォーカスを外す
- 調味料名に21文字以上入力する
- 調味料の種類を選択しないでフォーカスを外す
- 5MB以上の画像ファイルを選択する
- JPEG/PNG以外の画像ファイルを選択する

各バリデーションエラーがリアルタイムで表示されることを確認してください。
        `,
      },
    },
  },
};
