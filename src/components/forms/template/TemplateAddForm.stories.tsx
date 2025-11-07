import type { Meta, StoryObj } from "@storybook/react";
import { TemplateAddForm } from "@/components/forms/template/TemplateAddForm";
import { TemplateFormData } from "@/features/template/hooks";
import { STORYBOOK_DELAY_MEDIUM } from "@/constants/ui";

const meta: Meta<typeof TemplateAddForm> = {
  title: "Forms/Template/TemplateAddForm",
  component: TemplateAddForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの状態
 */
export const Default: Story = {
  args: {},
};

/**
 * 送信時の処理をコンソールに出力
 */
export const WithSubmitHandler: Story = {
  args: {
    onSubmit: async (data: TemplateFormData) => {
      console.log("送信されたデータ:", data);
      // 送信処理のシミュレーション
      await new Promise((resolve) =>
        setTimeout(resolve, STORYBOOK_DELAY_MEDIUM)
      );
    },
  },
};
