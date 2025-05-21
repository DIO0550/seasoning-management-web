import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layouts/headers/header";

export const metadata: Metadata = {
  title: "調味料管理",
  description: "調味料の管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
