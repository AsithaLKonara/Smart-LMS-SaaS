import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NotificationWrapper } from "@/components/providers/NotificationWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smart LMS SaaS - AI-Powered Learning Platform",
  description: "Modern, dark-themed Learning Management System with AI-powered tutoring, live classes, and comprehensive analytics",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionProvider>
            <NotificationWrapper>{children}</NotificationWrapper>
          </SessionProvider>
          <Toaster richColors theme="dark" position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
