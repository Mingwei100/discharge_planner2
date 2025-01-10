"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send } from "lucide-react"
import Anthropic from '@anthropic-ai/sdk'
import { facilities } from '@/components/facilities'
import { usePatient } from '@/components/contexts/PatientContext'
import Link from 'next/link'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { FacilityHistogram } from './FacilityHistogram'
import { FacilityHistogramPrice } from "./FacilityHistogramPrice"
import { patients } from '@/components/patients'
const anthropic = new Anthropic({
  apiKey: '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',
  dangerouslyAllowBrowser: true
})

// Add these near the top of the file, after imports
// ... existing code ...

const facilityTools = {
  filterByPrice: (facilities: any[], maxPrice: number) => {
    return facilities.filter(f => f.price <= maxPrice);
  },
  filterByRating: (facilities: any[], minRating: number) => {
    return facilities.filter(f => f.rating >= minRating);
  },
  filterByVacancies: (facilities: any[], minVacancies: number) => {
    return facilities.filter(f => f.vacancies >= minVacancies);
  },
  filterByDistance: async (facilities: any[], address: string, maxDistance: number) => {
    const apiKey = 'AIzaSyBm3f_tKNXoqvwDNS23O8XjN5Xg7ICUpdQ';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log('filter by ',address, 'distance', maxDistance)
    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const originLat = location.lat;
        const originLng = location.lng;
        console.log(originLat, originLng)
        return facilities.map(facility => {
          const distance = getDistance(originLat, originLng, facility.lat, facility.lng);
          return {
            ...facility,
            distance: Number(distance.toFixed(1))
          };
        }).filter(facility => facility.distance <= maxDistance);
      }
      
      return facilities; // Return all facilities if geocoding fails
    } catch (error) {
      console.error('Geocoding error:', error);
      return facilities; // Return all facilities if there's an error
    }
  },
  sortFacilities: (facilities: any[], criteria: string, order: 'asc' | 'desc') => {
    return [...facilities].sort((a, b) => {
      let comparison = 0;
      
      switch (criteria) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'vacancies':
          comparison = a.vacancies - b.vacancies;
          break;
        default:
          return 0;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }
};

// Helper function to calculate distance between two points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

// ... rest of code ...

export function CareLogicComponent() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm CareLogic AI, your discharge planning assistant. Tell me about the patient's needs and I'll help find suitable facilities."
    }
  ])
  const { selectedPatient: contextPatient } = usePatient();
  const [recommendedFacilities, setRecommendedFacilities] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [assignments, setAssignments] = useState<{[key: string]: string[]}>({})
  const [processingState, setProcessingState] = useState<string>('');
  const [filteredCount, setFilteredCount] = useState<number>(0);

  useEffect(() => {
    // Load assignments from localStorage on component mount
    const storedAssignments = localStorage.getItem('patientFacilityAssignments')
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments))
    }
  }, [])

  const isFacilityAssigned = (facilityId: string) => {
    return assignments[contextPatient]?.includes(facilityId) || false
  }


  const handleAssignFacility = async (facilityId: string) => {
    if (!contextPatient) {
      alert("Please select a patient first");
      return;
    }

    const newAssignments = { ...assignments }
    
    if (!newAssignments[contextPatient]) {
      newAssignments[contextPatient] = []
    }

    if (isFacilityAssigned(facilityId)) {
      // Remove the facility if it's already assigned
      newAssignments[contextPatient] = newAssignments[contextPatient].filter(id => id !== facilityId)
    } else {
      // Add the facility if it's not assigned
      newAssignments[contextPatient].push(facilityId)
    }
    
    setAssignments(newAssignments)
    localStorage.setItem('patientFacilityAssignments', JSON.stringify(newAssignments))
  };


  // Add test function
  const testAnthropicConnection = async () => {
    try {
      console.log('Starting Anthropic test...');
      const testMessage = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: 'Say hello'
        }]
      });
      console.log('Test successful! Response:', testMessage);
      alert('Test successful! Check console for details.');
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed. Check console for error details.');
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    setProcessingState('Thinking about requirements...');

    setMessages(prev => [...prev, {
      role: "user",
      content: input
    }])

    const attemptProcess = async (attempt: number = 1) => {
      try {
        // First call to determine filters and sorting
        setProcessingState('Analyzing patient needs...');
        const toolMessage = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system: `You are a facility matching assistant. Only apply filters and sorting that are explicitly mentioned in the user's request.

                  Available filters (only use if specifically requested):
                  - price: {"type": "price", "maxPrice": number} // When user mentions maximum price/budget
                  - rating: {"type": "rating", "minRating": number} // When user mentions minimum rating
                  - vacancies: {"type": "vacancies", "minVacancies": number} // When user mentions needing available spots
                  - distance: {"type": "distance", "fromLocation": string, "maxDistance": number} // When user mentions location and distance
                  
                  Available sorting (only use if specifically requested):
                  - sortBy: {
                      "type": "sort", 
                      "criteria": "price" | "distance" | "rating" | "vacancies",
                      "order": "asc" | "desc"
                    }

                  Respond with a JSON object containing ONLY filters and sorting that were explicitly requested:
                  {
                    "filters": [
                      // Only include filters that match explicitly mentioned criteria
                    ],
                    "sort": {
                      // Only include if user specifically requests sorting
                      "criteria": string,
                      "order": string
                    }
                  }
                  
                  Do not make assumptions or add filters/sorting unless clearly stated in the request.`,
          messages: [{
            role: 'user',
            content: input
          }]
        })

        console.log('Tools:', toolMessage.content[0].text);
        setProcessingState('Filtering facilities...');
        let filteredFacilities = facilities;
        const filterMatch = toolMessage.content[0].text.match(/\{[\s\S]*\}/);
        
        if (filterMatch) {
          const filterRequest = JSON.parse(filterMatch[0]);
          
          // Apply filters
          if (filterRequest.filters) {
            filteredFacilities = await filterRequest.filters.reduce(async(currentFacilitiesPromise, filter) => {
              const currentFacilities = await currentFacilitiesPromise;
              setProcessingState(`Applying ${filter.type} filter...`);
              let result;
              switch (filter.type) {
                case 'price':
                  result = facilityTools.filterByPrice(currentFacilities, filter.maxPrice);
                  // Mark facilities as price filtered
                  result = result.map(facility => ({
                    ...facility,
                    priceFiltered: true
                  }));
                  console.log(`After price filter (max $${filter.maxPrice}):`, result.length);
                  return result;
                case 'rating':
                  result = facilityTools.filterByRating(currentFacilities, filter.minRating);
                  console.log(`After rating filter (min ${filter.minRating}):`, result.length);
                  return result;
                case 'vacancies':
                  result = facilityTools.filterByVacancies(currentFacilities, filter.minVacancies);
                  console.log(`After vacancies filter (min ${filter.minVacancies}):`, result.length);
                  return result;
                case 'distance':
                  result = await facilityTools.filterByDistance(currentFacilities, filter.fromLocation, filter.maxDistance);
                  console.log(`After distance filter (max ${filter.maxDistance} miles):`, result.length);
                  return result;
                default:
                  return currentFacilities;
              }
            }, facilities);
          }

          // Add sorting after filters are applied
          if (filterRequest.sort) {
            setProcessingState(`Sorting facilities by ${filterRequest.sort.criteria}...`);
            filteredFacilities = facilityTools.sortFacilities(
              filteredFacilities,
              filterRequest.sort.criteria,
              filterRequest.sort.order
            );
          }

          // After filtering and sorting
          setFilteredCount(filteredFacilities.length);
          setProcessingState(`${filteredFacilities.length} out of ${facilities.length} facilities match requirements. Finding best matches...`);
        }

        // Second call with filtered facilities
        // Get patient details from contextPatient
        const patientDetails = patients.find(p => p.id.toString() === contextPatient);
        
        const message = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          system: `You are a facility matching assistant. Analyze patient needs and match them with suitable facilities.
                    
                    If medical conditions are provided:
                    - You must ONLY match facilities that EXPLICITLY mention handling the patient's specific medical conditions
                    - You must NOT match based on general services or amenities
                    
                    For example:
                    - If patient has Parkinson's, ONLY match facilities that specifically mention "Parkinson's" in their description
                    - If patient has Diabetes, ONLY match facilities that specifically mention "Diabetes" in their description
                    - If patient has Heart Disease, ONLY match facilities that specifically mention "Heart Disease" in their description
                    - If patient has Alzheimer's, ONLY match facilities that specifically mention "Alzheimer's" in their description (Memory Care is NOT sufficient)
                    
                    Consider in order of priority:
                    1. If provided, EXACT matches of patient's specific medical conditions in facility descriptions
                    2. Price within patient's budget
                    3. Location and accessibility
                    4. General amenities and services

                    Output JSON with facilityId, name, matchReason, and matchScore (0-100).
                    
                    Strict scoring rules when medical conditions are provided:
                    - Start at 0
                    - Add 70 points ONLY if facility explicitly mentions patient's exact medical conditions
                    - Add up to 15 points for price match
                    - Add up to 15 points for location/accessibility
                    - Facilities that don't explicitly mention patient's conditions score 0
                    - General services or amenities cannot substitute for condition matches
                    - Memory Care services do NOT count as matching Alzheimer's - the description must explicitly mention Alzheimer's
                    
                    If NO medical conditions are provided:
                    - Start at 0
                    - Add up to 50 points for price match
                    - Add up to 50 points for location/accessibility`,
          messages: [{
            role: 'user', 
            content: `Patient medical conditions: ${patientDetails?.medicalConditions?.join(', ') || 'None provided'}
                      
                      Available facilities: ${JSON.stringify(filteredFacilities)}
                      
                      ${patientDetails?.medicalConditions ? 
                        'Find facilities that EXPLICITLY mention treating the patient\'s exact medical conditions in their descriptions. Do not match based on general services or amenities. Memory Care is NOT sufficient for matching Alzheimer\'s - only match if Alzheimer\'s is explicitly mentioned.' :
                        'Find facilities based on price match and location/accessibility.'
                      } Return top 3 matches in JSON format.`
          }]
        })
        console.log(message)
        // Rest of your existing code for processing recommendations...
        const rawText = message.content[0].text;
        const jsonMatch = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
        if (!jsonMatch) {
          throw new Error('Could not find JSON array in response');
        }

        const jsonStr = jsonMatch[0];
        const recommendations = JSON.parse(jsonStr);

        const detailedRecommendations = recommendations.map((rec: any) => {
          const facilityDetails = filteredFacilities.find(f => f.id === rec.facilityId)
          return {
            ...facilityDetails,
            matchScore: rec.matchScore,
            matchReason: rec.matchReason
          }
        })
        
        setRecommendedFacilities(detailedRecommendations)

        const responseContent = `Here are the recommended facilities:\n\n${
          recommendations.map((rec: any) => 
            `${rec.name} (Match Score: ${rec.matchScore}%)\n${rec.matchReason}`
          ).join('\n\n')
        }`

        setMessages(prev => [...prev, {
          role: "assistant",
          content: responseContent,
          recommendations: recommendations
        }])

      } catch (error) {
        console.error(`AI response error (attempt ${attempt}):`, error);
        if (attempt === 1) {
          console.log('Retrying process...');
          setProcessingState('First attempt failed. Retrying...');
          return attemptProcess(2);
        } else {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `Error processing recommendations after multiple attempts: ${error.message}`
          }]);
          setRecommendedFacilities([]);
        }
      }
    };

    try {
      await attemptProcess();
    } finally {
      setLoading(false);
      setProcessingState('');
      setFilteredCount(0);
    }

    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">

      <div className="flex flex-col flex-1 mb-4">
        <Card className="flex-1 mb-4">
          <CardContent className="p-6 h-full">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className={message.role === "assistant" ? "bg-primary" : "bg-muted"}>
                        <AvatarFallback>
                          {message.role === "assistant" ? <Bot className="h-4 w-4" /> : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {processingState && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <Avatar className="bg-primary">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-4 bg-muted">
                        <div className="flex items-center gap-2">
                          {processingState}
                          <PulseLoader color="#666" size={4} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder={contextPatient === "None" ? "Type your message..." : `Searching facilities for ${patients.find(p => p.id === parseInt(contextPatient))?.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      {recommendedFacilities.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {recommendedFacilities.map((facility) => (
            <Card key={facility.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{facility.name}</CardTitle>
                <div className="text-sm font-medium">Match Score: {facility.matchScore}%</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {facility.location}</p>
                  <p><strong>Capacity:</strong> {facility.capacity}</p>
                  <p><strong>Vacancies:</strong> {facility.vacancies}</p>
                  <p><strong>Rating:</strong> {facility.rating}/5</p>
                  {facility.priceFiltered && (
                    <>
                      <p><strong>Price:</strong> ${facility.price}/month</p>
                      <FacilityHistogramPrice 
                        facilities={facilities} 
                        currentFacility={facility}
                      />
                    </>
                  )}
                  {facility.distance !== undefined && (
                    <>
                      <p><strong>Distance:</strong> {facility.distance} miles</p>
                      <FacilityHistogram 
                        facilities={facilities} 
                        currentFacility={facility}
                      />
                    </>
                  )}
                  <p><strong>Match Reason:</strong> {facility.matchReason}</p>
                </div>
                {contextPatient && contextPatient !== "None" ? (
                  <Button 
                    variant={isFacilityAssigned(facility.id) ? "destructive" : "outline"}
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => handleAssignFacility(facility.id)}
                  >
                    {isFacilityAssigned(facility.id) ? "Unassign Facility" : "Assign Facility"}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href={`/facilities/${facility.id}`}>View Details</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}