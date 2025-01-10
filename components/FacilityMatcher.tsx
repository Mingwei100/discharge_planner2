import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { facilities } from '@/components/facilities'

const anthropic = new Anthropic({
  apiKey: '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',
  dangerouslyAllowBrowser: true
})

// Define a type for facility recommendations
interface FacilityRecommendation {
  facilityId: string;
  name: string;
  matchReason: string;
  matchScore: number;
}

export function FacilityMatcher() {
  const [recommendations, setRecommendations] = useState<FacilityRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const getFacilityRecommendations = async (patientNeeds: string) => {
    setLoading(true)
    
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        system: `You are a facility matching assistant. Your task is to analyze patient needs and match them with the most suitable facilities from the provided list. 
                Output should be in JSON format with facility recommendations, including facilityId, name, matchReason, and a matchScore (0-100).
                Focus on key factors like care level, price, location, and specific patient requirements.`,
        messages: [{
          role: 'user',
          content: `Patient needs: ${patientNeeds}
                    Available facilities: ${JSON.stringify(facilities)}
                    Please provide the top 3 facility matches in JSON format.`
        }]
      })

      // Parse the response into FacilityRecommendation[]
      const recommendations = JSON.parse(message.content[0].text) as FacilityRecommendation[]
      setRecommendations(recommendations)
    } catch (error) {
      console.error('Facility matching error:', error)
    }
    
    setLoading(false)
  }

  // Example usage with a patient profile
  const handleMatchFacilities = () => {
    const patientNeeds = `
      Age: 75
      Care Level: Moderate assistance needed
      Budget: $6000/month
      Location: Prefers within 10 miles of downtown
      Special Requirements: Diabetes management, mobility assistance
      Preferences: Activities program, garden access
    `
    getFacilityRecommendations(patientNeeds)
  }

  return (
    <div className="p-4">
      <button 
        onClick={handleMatchFacilities}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Match Facilities
      </button>

      {loading && <div>Finding best matches...</div>}

      <div className="mt-4 space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.facilityId} className="border p-4 rounded">
            <h3 className="font-bold">{rec.name}</h3>
            <p>Match Score: {rec.matchScore}%</p>
            <p>{rec.matchReason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}