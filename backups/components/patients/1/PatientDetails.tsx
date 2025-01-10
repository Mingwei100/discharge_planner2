"use client"
import Image, {StaticImageData} from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { facilities } from '@/components/facilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PatientDetailsProps {
  id: number
  name: string
  age: number
  gender: string
  diagnosis: string[]
  medications: string[]
  careNeeds: string[]
  notes: string
  admissionDate: string
  roomNumber: string
  image: string | StaticImageData
}

export function PatientDetailsComponent({
  id,
  name,
  age,
  gender,
  diagnosis,
  medications,
  careNeeds,
  notes,
  admissionDate,
  roomNumber,
  image,
}: PatientDetailsProps) {
  const [assignedFacilities, setAssignedFacilities] = useState<any[]>([])

  useEffect(() => {
    // Load facility assignments from localStorage
    const savedAssignments = localStorage.getItem("patientFacilityAssignments")
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : {}
    
    // Get facility IDs for the patient
    const patientFacilities = assignments[id.toString()] || []
    
    // Map facility IDs to full facility objects
    const matchedFacilities = facilities.filter(f => patientFacilities.includes(f.id))
    setAssignedFacilities(matchedFacilities)
  }, [id])

  return (
    <Tabs defaultValue="patient" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="patient">Patient</TabsTrigger>
        <TabsTrigger value="compare">Compare Facilities</TabsTrigger>
      </TabsList>

      <TabsContent value="patient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-6">{name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <div className="aspect-square relative w-64 h-64 mx-auto md:mx-0">
                  <Image
                    src={image}
                    alt={`Photo of ${name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-3">Patient Information</h2>
              <p className="text-base text-muted-foreground mb-4">
                {`${age} years old, ${gender}`}
              </p>
              <p className="text-base text-muted-foreground mb-4">
                {`Admitted on: ${admissionDate}`}
              </p>
              <p className="text-base text-muted-foreground mb-4">
                {`Room Number: ${roomNumber}`}
              </p>
              
              <h2 className="text-2xl font-semibold mb-3">Diagnosis</h2>
              <ul className="space-y-2 mb-6">
                {diagnosis.map((item, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-semibold mb-3">Medications</h2>
              <ul className="space-y-2 mb-6">
                {medications.map((med, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-semibold mb-3">Care Needs</h2>
              <ul className="space-y-2 mb-6">
                {careNeeds.map((need, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <CheckCircle className="mr-2 h-5 w-5 text-yellow-500" />
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-semibold mb-3">Notes</h2>
              <p className="text-muted-foreground">{notes}</p>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full">Update Care Plan</Button>
                  <Button className="w-full" variant="outline">Schedule Appointment</Button>
                  <Button className="w-full" variant="outline">View Medical Records</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Assigned Facilities</h3>
                  <div className="space-y-2">
                    {assignedFacilities.map((facility, index) => (
                      <div key={index} className="bg-secondary p-3 rounded">
                        <div className="font-medium">{facility.name}</div>
                        <div className="text-sm text-muted-foreground">${facility.price}/month</div>
                      </div>
                    ))}
                    {assignedFacilities.length === 0 && (
                      <p className="text-muted-foreground text-sm">No facilities currently assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="compare">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {assignedFacilities.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold bg-secondary">Attribute</th>
                      {assignedFacilities.map((facility, index) => (
                        <th key={index} className="text-left p-4 font-semibold border-l">{facility.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">Location</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">{facility.location}</td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">Type</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">{facility.type}</td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">Price</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">${facility.price}/month</td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">Capacity</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">{facility.capacity} beds</td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">Current Vacancies</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">{facility.vacancies} available</td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium bg-secondary">ALW Status</td>
                      {assignedFacilities.map((facility, index) => (
                        <td key={index} className="p-4 text-muted-foreground border-l">{facility.alwStatus}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No facilities assigned to compare</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}