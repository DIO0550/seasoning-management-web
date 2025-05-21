import Link from "next/link";
import { Button } from "@/components/elements/buttons/button";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">調味料管理アプリへ</span>
          <span className="block text-blue-600">ようこそ</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          調味料の管理を簡単に。期限切れを防ぎ、必要な調味料を常に把握できます。
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/seasoning/list">
            <Button variant="primary" size="lg">調味料一覧</Button>
          </Link>
          <Link href="/template/list">
            <Button variant="outline" size="lg">テンプレート一覧</Button>
          </Link>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">主な機能</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">調味料の管理</h3>
              <p className="mt-2 text-gray-500">
                家庭内の調味料の在庫を簡単に管理。期限切れも防止します。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">テンプレート機能</h3>
              <p className="mt-2 text-gray-500">
                よく使う調味料の組み合わせをテンプレートとして保存できます。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">簡単操作</h3>
              <p className="mt-2 text-gray-500">
                直感的なインターフェースで、誰でも簡単に使用できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
