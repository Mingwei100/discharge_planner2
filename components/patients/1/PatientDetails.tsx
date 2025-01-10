"use client"
import Image, {StaticImageData} from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Pencil, Trash2, Star } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { facilities } from '@/components/facilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"


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

interface TimelineNote {
  id: string
  content: string
  timestamp: string
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
  const [completedTimelineSteps, setCompletedTimelineSteps] = useState<number[]>([])
  const [timelineNotes, setTimelineNotes] = useState<TimelineNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [message, setMessage] = useState(
    `To whom it may concern,\n\nI am writing to confirm your availability for an assisted living patient. Their details are attached below. Thanks!`
  )
  const { toast } = useToast()

  useEffect(() => {
    // Load facility assignments from localStorage
    const savedAssignments = localStorage.getItem("patientFacilityAssignments")
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : {}
    
    // Get facility IDs for the patient
    const patientFacilities = assignments[id.toString()] || []
    
    // Map facility IDs to full facility objects
    const matchedFacilities = facilities.filter(f => patientFacilities.includes(f.id))
    setAssignedFacilities(matchedFacilities)

    // Load timeline steps
    const savedSteps = localStorage.getItem(`patient-${id}-timeline`)
    if (savedSteps) {
      setCompletedTimelineSteps(JSON.parse(savedSteps))
    }

    // Load timeline notes
    const savedNotes = localStorage.getItem(`patient-${id}-timeline-notes`)
    if (savedNotes) {
      setTimelineNotes(JSON.parse(savedNotes))
    }
  }, [id])

  const handleSaveNote = () => {
    if (!newNote.trim()) return

    const updatedNotes = [...timelineNotes]

    if (editingNoteId) {
      const noteIndex = updatedNotes.findIndex(note => note.id === editingNoteId)
      if (noteIndex !== -1) {
        updatedNotes[noteIndex] = {
          ...updatedNotes[noteIndex],
          content: newNote,
        }
      }
    } else {
      updatedNotes.push({
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date().toLocaleString()
      })
    }

    setTimelineNotes(updatedNotes)
    localStorage.setItem(`patient-${id}-timeline-notes`, JSON.stringify(updatedNotes))
    setNewNote("")
    setEditingNoteId(null)
  }

  const handleEditNote = (note: TimelineNote) => {
    setNewNote(note.content)
    setEditingNoteId(note.id)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = timelineNotes.filter(note => note.id !== noteId)
    setTimelineNotes(updatedNotes)
    localStorage.setItem(`patient-${id}-timeline-notes`, JSON.stringify(updatedNotes))
  }

  const handleSendMessage = () => {
    toast({
      title: "Message Sent!",
      duration: 2000
    })
  }

  return (
    <Tabs defaultValue="patient" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="patient">Patient</TabsTrigger>
        <TabsTrigger value="compare">Compare Facilities</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button className="w-full" variant="outline">Schedule Appointment</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="flex gap-6 p-4 max-w-4xl mx-auto">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-4">Schedule Appointment</h3>
                          <Textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[200px] mb-4"
                          />
                          <Button onClick={handleSendMessage} className="w-full">
                            Send to Selected Facilities
                          </Button>
                        </div>
                        <div className="w-64">
                          <h4 className="font-medium mb-2">Selected Facilities</h4>
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="text-left p-2 border-b">Facility</th>
                                <th className="w-12 p-2 border-b">Send</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignedFacilities.map((facility, index) => (
                                <tr key={index}>
                                  <td className="p-2 border-b">{facility.name}</td>
                                  <td className="p-2 border-b text-center">
                                    <input type="checkbox" className="h-4 w-4" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button className="w-full" variant="outline">View Medical Records</Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh]">
                      <div className="p-4 w-full">
                        <h3 className="text-lg font-semibold mb-4">Medical Records</h3>
                        <div className="w-full h-[600px]">
                          <embed 
                            src="/602_form.pdf"
                            type="application/pdf"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Assigned Facilities</h3>
                  <div className="flex flex-col gap-2">
                    {assignedFacilities.map((facility, index) => (
                      <ContextMenu key={index}>
                        <ContextMenuTrigger className="block">
                          <div className="bg-secondary p-3 rounded">
                            <div className="font-medium">{facility.name}</div>
                            <div className="text-sm text-muted-foreground">${facility.price}/month</div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onSelect={() => {
                            const storedAssignments = localStorage.getItem('patientFacilityAssignments');
                            if (storedAssignments) {
                              const assignments = JSON.parse(storedAssignments);
                              if (assignments[id]) {
                                assignments[id] = assignments[id].filter((fid: string) => fid !== facility.id);
                                localStorage.setItem('patientFacilityAssignments', JSON.stringify(assignments));
                                window.location.reload(); // Refresh to show changes
                              }
                            }
                          }}>
                            Remove Facility
                          </ContextMenuItem>
                          <ContextMenuItem asChild>
                            <a href={`/facilities/${facility.id}`}>View Facility</a>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
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
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Facility Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-4 font-semibold bg-secondary/80 rounded-tl-lg">Attribute</th>
                        {assignedFacilities.map((facility, index) => (
                          <th key={index} className={`text-left p-4 font-semibold bg-primary/5 border-l-2 ${index === assignedFacilities.length - 1 ? 'rounded-tr-lg' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span>{facility.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Rating</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">
                            <div className="flex items-center gap-1">
                              {[...Array(Math.floor(facility.rating))].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Location</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">{facility.location}</td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Type</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">
                            <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">{facility.type}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Price</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">
                            <span className="font-semibold">${facility.price}</span>/month
                          </td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Capacity</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">{facility.capacity} beds</td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">Current Vacancies</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">
                            <span className="text-green-600 font-medium">{facility.vacancies}</span> available
                          </td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50">ALW Status</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className="p-4 text-muted-foreground border-l-2">{facility.alwStatus}</td>
                        ))}
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium bg-secondary/50 rounded-bl-lg">Description</td>
                        {assignedFacilities.map((facility, index) => (
                          <td key={index} className={`p-4 text-muted-foreground border-l-2 ${index === assignedFacilities.length - 1 ? 'rounded-br-lg' : ''}`}>
                            {facility.description}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No facilities assigned to compare</p>
              <p className="text-sm text-muted-foreground mt-2">Add facilities to see a detailed comparison</p>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="timeline">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative flex justify-between gap-4 mb-8">
            {/* Add connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10" />
            
            {[
              "Informational Call",
              "Facility Suggestions", 
              "Financial Assessment",
              "Medical Assessment",
              "Placement"
            ].map((step, index) => {
              const isCompleted = completedTimelineSteps.includes(index);
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  {/* Step number circle */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </div>
                  
                  <Card 
                    className={`w-full cursor-pointer transition-all
                      ${isCompleted 
                        ? 'bg-green-100 border-green-500' 
                        : 'hover:border-gray-400'
                      }
                      ${index < Math.max(...completedTimelineSteps, 0) 
                        ? 'opacity-50' 
                        : 'opacity-100'
                      }`}
                    onClick={() => {
                      const currentSteps = JSON.parse(localStorage.getItem(`patient-${id}-timeline`) || '[]');
                      const newSteps = currentSteps.includes(index)
                        ? currentSteps.filter((i: number) => i !== index)
                        : [...currentSteps, index];
                      localStorage.setItem(`patient-${id}-timeline`, JSON.stringify(newSteps));
                      setCompletedTimelineSteps(newSteps);
                    }}
                  >
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold text-center">{step}</h3>
                      {/* Optional: Add description */}
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        {isCompleted ? 'Completed' : 'Pending'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Timeline Notes Section */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-4">Timeline Notes</h3>
              
              {/* Display existing notes */}
              <div className="space-y-4 mb-6">
                {timelineNotes.map((note) => (
                  <div key={note.id} className="bg-secondary p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{note.timestamp}</p>
                        <p>{note.content}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditNote(note)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new note */}
              <div className="flex gap-4">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveNote}>
                  {editingNoteId ? 'Update Note' : 'Add Note'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}