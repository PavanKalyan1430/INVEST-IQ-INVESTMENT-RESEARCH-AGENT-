import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InvestIQ AI — Institutional-Grade Investment Research",
  description:
    "7 specialized AI agents analyze any public company and deliver structured INVEST/PASS recommendations with full financial analysis, news sentiment, and risk assessment.",
  keywords: ["investment research", "AI analysis", "stock analysis", "financial AI", "LangGraph"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
