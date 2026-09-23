import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import SessionProvider from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MAXLITH Management",
    template: "%s | MAXLITH Management",
  },
  description: "Internal company management platform for MAXLITH — AI Trading Intelligence",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
