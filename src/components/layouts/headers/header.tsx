import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export const Header = ({ title = '調味料管理' }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                {title}
              </Link>
            </div>
            <nav className="ml-6 flex space-x-4 items-center">
              <Link href="/seasoning/list" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                調味料一覧
              </Link>
              <Link href="/template/list" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                テンプレート一覧
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};