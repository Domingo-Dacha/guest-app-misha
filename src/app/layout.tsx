import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  preload: false,
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Помощь гостю · Domingo Дача",
  description: "Инструкции по дому и обращения в службу заботы Domingo Дача",
  robots: { index: false, follow: false },
  applicationName: "Domingo Guest Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
