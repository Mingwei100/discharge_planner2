"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { patients } from '@/components/patients'

export function PatientComponent() {
  const [searchTerm, setSearchTerm] = useState("")

  // Randomly generated patient data
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
          </div>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registered Date</TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.registeredDate}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "Active" ? "default" :
                          patient.status === "Pending" ? "secondary" :
                          "outline"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.budget}</TableCell>
                    <TableCell>
                      <Link href={`/patients/${patient.id}`} passHref>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}