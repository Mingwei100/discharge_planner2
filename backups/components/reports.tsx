"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, List, Grid, Filter } from "lucide-react"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { facilities } from '@/components/facilities'
import { patients } from '@/components/patients'
import { Progress } from "@/components/ui/progress"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import Link from 'next/link'
// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false })

interface GeocodeResult {
  status: string;
  result?: {
    lat: number;
    lng: number;
  };
  error?: string;
}

async function geocode(address: string): Promise<GeocodeResult> {
  const apiKey = 'AIzaSyBm3f_tKNXoqvwDNS23O8XjN5Xg7ICUpdQ';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        status: 'Valid address received',
        result: {
          lat: location.lat,
          lng: location.lng
        }
      };
    } else {
      return {
        status: 'Could not geocode. Please try again using a valid address.',
        error: 'No results found'
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      status: 'An error occurred while geocoding.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

export function ReportsComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [capacityFilter, setCapacityFilter] = useState("")
  const [alwFilter, setAlwFilter] = useState("")
  const [vacanciesFilter, setVacanciesFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [distanceFilter, setDistanceFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [maxResults, setMaxResults] = useState("50")
  const [sortBy, setSortBy] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  const filteredFacilities = facilities.filter(facility => {
    const nameMatch = true;
    const locationMatch = true;//facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    const capacityMatch = capacityFilter === "" || capacityFilter === "any" || parseInt(facility.capacity) <= parseInt(capacityFilter);
    const alwMatch = alwFilter === "" || alwFilter === "any" || facility.alwStatus === alwFilter;
    const vacanciesMatch = vacanciesFilter === "" || vacanciesFilter === "any" || facility.vacancies >= parseInt(vacanciesFilter);
    const typeMatch = typeFilter === "" || typeFilter === "any" || facility.type === typeFilter;
    const priceMatch = priceFilter === "" || priceFilter === "any" || facility.price <= parseInt(priceFilter);
    
    let distanceMatch = true;
    if (geocodeResult && geocodeResult.result && distanceFilter !== "" && distanceFilter !== "any") {
      const distance = getDistance(
        geocodeResult.result.lat,
        geocodeResult.result.lng,
        facility.lat,
        facility.lng
      );
      distanceMatch = distance <= parseInt(distanceFilter);
    }

    return nameMatch && locationMatch && capacityMatch && alwMatch && vacanciesMatch && typeMatch && distanceMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "vacancy") {
      return b.vacancies - a.vacancies;
    } else if (sortBy === "price") {
      return a.price - b.price;
    } else if (sortBy === "distance" && geocodeResult && geocodeResult.result) {
      const distanceA = getDistance(geocodeResult.result.lat, geocodeResult.result.lng, a.lat, a.lng);
      const distanceB = getDistance(geocodeResult.result.lat, geocodeResult.result.lng, b.lat, b.lng);
      return distanceA - distanceB;
    }
    return 0;
  }).slice(0, parseInt(maxResults));

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      const result = await geocode(value);
      setGeocodeResult(result);
    } else {
      setGeocodeResult(null);
    }
  };

  const handleFacilitySelect = (facilityId: string) => {
    setSelectedFacilities(prev => {
      if (prev.includes(facilityId)) {
        return prev.filter(id => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
  };

  const handleAssignFacilities = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first");
      return;
    }
    if (selectedFacilities.length === 0) {
      alert("Please select at least one facility");
      return;
    }

    // Get existing assignments from localStorage
    const existingAssignments = JSON.parse(localStorage.getItem('patientFacilityAssignments') || '{}');
    
    // Update assignments for selected patient
    existingAssignments[selectedPatient] = selectedFacilities;
    
    // Save back to localStorage
    localStorage.setItem('patientFacilityAssignments', JSON.stringify(existingAssignments));
    
    // Reset selections after assignment
    setSelectedFacilities([]);
    setSelectedPatient("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search facilities..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="vacancy">Vacancy</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter Options</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter Options</DrawerTitle>
              <DrawerDescription>Adjust your search criteria</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <Select onValueChange={setCapacityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="100">Up to 100</SelectItem>
                  <SelectItem value="150">Up to 150</SelectItem>
                  <SelectItem value="200">Up to 200</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setAlwFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ALW Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setVacanciesFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vacancies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                  <SelectItem value="15">15+</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                  <SelectItem value="Independent Living">Independent Living</SelectItem>
                  <SelectItem value="Board and Care">Board and Care</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setDistanceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Max Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="5000">Up to $5,000</SelectItem>
                  <SelectItem value="7500">Up to $7,500</SelectItem>
                  <SelectItem value="10000">Up to $10,000</SelectItem>
                  <SelectItem value="15000">Up to $15,000</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setMaxResults}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Max Results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Apply Filters</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {searchTerm && (!geocodeResult || !geocodeResult.result) && (
          <span className="text-red-500 self-center">Address not found</span>
        )}
      </div>
      <div className="flex gap-6 mt-6">
        <div className="w-1/2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assisted Living Facilities</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {viewMode === "list" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead className="text-xs">Facility Name</TableHead>
                        <TableHead className="text-xs">Occupancy</TableHead>
                        <TableHead className="text-xs">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFacilities.map((facility) => {
                        const capacity = parseInt(facility.capacity);
                        const occupancy = capacity - facility.vacancies;
                        const occupancyPercentage = (occupancy / capacity) * 100;
                        return (
                          <TableRow key={facility.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedFacilities.includes(facility.id)}
                                onCheckedChange={() => handleFacilitySelect(facility.id)}
                                disabled={!selectedPatient}
                              />
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">{facility.name}</TableCell>
                            <TableCell className="text-xs whitespace-nowrap">
                              <div>Occupancy: {occupancy}/{capacity}</div>
                              <Progress value={occupancyPercentage} className="w-[100px]" />
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/facilities/1`}>View Details</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredFacilities.map((facility) => (
                      <Card key={facility.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{facility.name}</CardTitle>
                            <Checkbox
                              checked={selectedFacilities.includes(facility.id)}
                              onCheckedChange={() => handleFacilitySelect(facility.id)}
                              disabled={!selectedPatient}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p><MapPin className="inline mr-2" />{facility.location}</p>
                          <p>Capacity: {facility.capacity}</p>
                          <p>ALW Status: {facility.alwStatus}</p>
                          <p>Vacancies: {facility.vacancies}</p>
                          <p>Type: {facility.type}</p>
                          <p>Price: ${facility.price}</p>
                          <Button variant="outline" size="sm" className="mt-2" asChild>
                            <Link href={`/facilities/${facility.id}`}>View More Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Facility Locations Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] relative">
                <div className="absolute inset-0 z-0">
                  <Map facilities={filteredFacilities} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Patient Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPatient && selectedFacilities.length > 0 && (
                <Button onClick={handleAssignFacilities}>
                  Assign Selected Facilities
                </Button>
              )}
            </div>

            {selectedPatient && (
              <div className="bg-secondary p-4 rounded-lg">
                {patients.map(patient => {
                  if (patient.id.toString() === selectedPatient) {
                    return (
                      <div key={patient.id} className="space-y-2">
                        <div className="font-medium text-lg">{patient.name}</div>
                        <div className="text-muted-foreground">
                          <div><span className="font-medium">Address:</span> {patient.location}</div>
                          <div><span className="font-medium">Medical Conditions:</span> {patient.medicalConditions.join(", ")}</div>
                          <div><span className="font-medium">Ambulatory:</span> {patient.ambulatory}</div>
                          <div><span className="font-medium">Budget:</span> {patient.budget}</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}