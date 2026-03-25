import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";

export const metadata: Metadata = {
  title: "墨韵博客 - 记录思考与成长",
  description: "一个精美的个人技术博客，分享编程、技术和生活的点滴。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}