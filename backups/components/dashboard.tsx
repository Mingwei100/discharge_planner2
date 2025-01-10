"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Users, FileText, Settings, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import localImage from '@/assets/sample_rcfe.jpeg'
import localImage2 from '@/assets/sample_rcfe2.jpg'
import localImage3 from '@/assets/sample_rcfe3.jpg'

import Image from 'next/image'

export function DashboardComponent() {
  const [patientName, setPatientName] = useState("")
  const [careLevel, setCareLevel] = useState("")
  const [budget, setBudget] = useState("")
  const [urgency, setUrgency] = useState("")

  const communities = [
    { name: "Sunrise Senior Living", budget: "$4000-$4999", urgency: "Urgent (Within 60 Days)", match: 95 },
    { name: "Brookdale Senior Living", budget: "Below $2000", urgency: "Not Urgent", match: 85 },
    { name: "Atria Senior Living", budget: "$3000-$3999", urgency: "Somewhat Urgent", match: 80 },
  ]

  const leads = [
    { name: "John Doe", community: "Sunrise Senior Living", status: "Attempted - No Answer" },
    { name: "Jane Smith", community: "Brookdale Senior Living", status: "Lead Lost - Unfit" },
    { name: "Bob Johnson", community: "Atria Senior Living", status: "Booked" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      
      <main className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="newPatient">New Patient</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <h2 className="text-2xl font-bold mb-4">Welcome, Discharge Planner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Patients:</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Placements:</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful Transitions:</span>
                      <span className="font-bold">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <ul className="space-y-2">
                      <li>New patient added: Sarah Johnson</li>
                      <li>Placement confirmed: Michael Brown at Sunrise Senior Living</li>
                      <li>Follow-up scheduled: Emily Davis</li>
                      <li>Community tour booked: Robert Wilson at Brookdale Senior Living</li>
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Facility Highlight</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-2">Sunrise Assisted Living</h3>
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600">Occupancy: 160/200</p>
                  <div className="w-64 h-2 bg-gray-200 rounded-full mt-2">
                    <div className="w-[80.5%] h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <Carousel className="w-3/4 max-w-md">
                  <CarouselContent>
                    <CarouselItem className="h-[192px]">
                      <Card className="overflow-hidden h-full">
                        <Image src={localImage.src} alt="Facility image 1" width={400} height={192} className="w-full h-full object-cover" />
                      </Card>
                    </CarouselItem>
                    <CarouselItem className="h-[192px]">
                      <Card className="overflow-hidden h-full">
                        <Image src={localImage2.src} alt="Facility image 2" width={400} height={192} className="w-full h-full object-cover" />
                      </Card>
                    </CarouselItem>
                    <CarouselItem className="h-[192px]">
                      <Card className="overflow-hidden h-full">
                        <Image src={localImage3.src} alt="Facility image 3" width={400} height={192} className="w-full h-full object-cover" />
                      </Card>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="newPatient">
            <Card>
              <CardHeader>
                <CardTitle>New Patient Information</CardTitle>
                <CardDescription>Enter patient details to find suitable communities</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careLevel">Care Level</Label>
                      <Select value={careLevel} onValueChange={setCareLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select care level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="independent">Independent Living</SelectItem>
                          <SelectItem value="assisted">Assisted Living</SelectItem>
                          <SelectItem value="memory">Memory Care</SelectItem>
                          <SelectItem value="skilled">Skilled Nursing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="below2000">Below $2000</SelectItem>
                          <SelectItem value="2000-2999">$2000 - $2999</SelectItem>
                          <SelectItem value="3000-3999">$3000 - $3999</SelectItem>
                          <SelectItem value="4000-4999">$4000 - $4999</SelectItem>
                          <SelectItem value="5000+">$5000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (Within 60 Days)</SelectItem>
                          <SelectItem value="somewhat">Somewhat Urgent</SelectItem>
                          <SelectItem value="not">Not Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Special Requirements</Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="memory" />
                        <label htmlFor="memory">Memory Care</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="physicalTherapy" />
                        <label htmlFor="physicalTherapy">Physical Therapy</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="petFriendly" />
                        <label htmlFor="petFriendly">Pet-Friendly</label>
                      </div>
                    </div>
                  </div>
                  <Button type="submit">Find Communities</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recommended Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {communities.map((community, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b">
                      <div>
                        <h3 className="font-semibold">{community.name}</h3>
                        <div className="flex space-x-2 mt-1">
                          <Badge variant={community.budget.includes("Below") ? "destructive" : "default"}>
                            {community.budget}
                          </Badge>
                          <Badge variant={community.urgency.includes("Urgent") ? "warning" : "default"}>
                            {community.urgency}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">{community.match}%</span>
                        <p className="text-sm text-muted-foreground">Match</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>Track and manage patient leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.community}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            lead.status === "Booked"
                              ? "success"
                              : lead.status.includes("Lost")
                              ? "destructive"
                              : "default"
                          }
                        >
                          {lead.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle>Open Leads</CardTitle>
                <CardDescription>View and manage open patient leads</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <ul className="space-y-2">
                    {[
                      { name: "Alice Johnson", community: "Sunrise Senior Living", status: "Open" },
                      { name: "David Lee", community: "Brookdale Senior Living", status: "Open" },
                      { name: "Emma Wilson", community: "Atria Senior Living", status: "Open" },
                      { name: "Frank Miller", community: "Sunrise Senior Living", status: "Open" },
                      { name: "Grace Taylor", community: "Brookdale Senior Living", status: "Open" }
                    ].map((lead, index) => (
                      <li key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{lead.name}</h3>
                            <p className="text-sm text-muted-foreground">{lead.community}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">{lead.status}</Badge>
                          <Button size="sm" variant="outline">
                            Update
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <Button className="mt-4 w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}