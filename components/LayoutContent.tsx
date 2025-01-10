'use client'

import { Card } from "@/components/ui/card";
import { PatientProvider } from '@/components/contexts/PatientContext';
import { SidebarContent } from './SidebarContent'; // We'll move SidebarContent to its own file

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <PatientProvider>
      <div className="flex h-screen bg-gray-100">
        <Card className="w-48 h-full rounded-none border-r">
          <SidebarContent />
        </Card>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </PatientProvider>
  );
}