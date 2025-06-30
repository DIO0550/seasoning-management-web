"use client";

import React from 'react';
import { TemplateAddForm } from '../../../components/forms/template/TemplateAddForm';
import { TemplateFormData } from '../../../hooks/useTemplateSubmit';

/**
 * テンプレート追加ページコンポーネント
 *
 * テンプレートを新規作成するためのページを提供します。
 * テンプレート追加フォームを含み、追加処理を行います。
 *
 * @returns テンプレート追加ページのJSX要素
 */
export default function TemplateAddPage(): React.JSX.Element {
  const handleSubmit = async (data: TemplateFormData) => {
    // TODO: GraphQL API呼び出しを実装
    console.log('テンプレート追加:', data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">テンプレート追加</h1>
      <div className="max-w-md mx-auto">
        <TemplateAddForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
