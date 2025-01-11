

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutContent } from "@/components/LayoutContent";
import {Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Discharge Planner",
  description: "Discharge planning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutContent>
          {children}
        </LayoutContent>
        <Toaster />
      </body>
    </html>
  );
}
