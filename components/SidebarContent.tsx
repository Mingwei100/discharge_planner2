'use client'

import { usePatient } from "@/components/contexts/PatientContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients } from "@/components/patients";
import { LayoutDashboard, Building2, Users, Settings, NotebookTabs, Bot } from "lucide-react";
import Link from 'next/link';

export function SidebarContent() {
  const { setSelectedPatient } = usePatient();

  return (
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
        <Link href="/carelogic">
          <Button variant="ghost" className="w-full justify-start">
            <Bot className="mr-2 h-3 w-3 text-gray-500" />
            <span className="text-sm">CareLogicAI</span>
          </Button>
        </Link>
        <Select onValueChange={(value) => {
          setSelectedPatient(value);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id.toString()}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
}