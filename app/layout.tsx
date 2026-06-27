import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskForge — AI Productivity Assistant",
  description:
    "Generate personalised AI productivity plans and track your goals with TaskForge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#fffcf4] text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
