import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';
import { LayoutDashboard, Building2, Users, Settings, NotebookTabs } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        <div className="flex h-screen bg-gray-100">
          <Card className="w-48 h-full rounded-none border-r">
            <nav className="p-4 space-y-4">
              <Button variant="ghost" className="w-full justify-start">
                <NotebookTabs className="mr-2 h-4 w-4" />
                <span className="text-sm font-bold">Discharge CRM</span>
              </Button>
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-3 w-3 text-gray-500" />
                    <span className="text-sm">Dashboard</span>
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="ghost" className="w-full justify-start">
                    <Building2 className="mr-2 h-3 w-3 text-gray-500" />
                    <span className="text-sm">Facilities</span>
                  </Button>
                </Link>
                <Link href="/patients">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-3 w-3 text-gray-500" />
                    <span className="text-sm">Patients</span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-3 w-3 text-gray-500" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </Link>
              </div>
            </nav>
          </Card>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}