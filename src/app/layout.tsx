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
  title: "Domingo Guest Lab",
  description: "Универсальный шаблон гостевого мобильного приложения Domingo",
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
