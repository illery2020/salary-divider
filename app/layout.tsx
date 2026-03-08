import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Salary Divider",
  description: "給与分割シミュレーター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="max-w-lg mx-auto px-4 py-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
