
import { createContext, useContext, useState, ReactNode } from 'react'

interface PatientContextType {
  selectedPatient: string
  setSelectedPatient: (id: string) => void
  selectedFacilities: string[]
  setSelectedFacilities: (facilities: string[]) => void
  handleAssignFacilities: () => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  const handleAssignFacilities = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }
    if (selectedFacilities.length === 0) {
      alert("Please select at least one facility")
      return
    }

    const existingAssignments = JSON.parse(localStorage.getItem('patientFacilityAssignments') || '{}')
    existingAssignments[selectedPatient] = selectedFacilities
    localStorage.setItem('patientFacilityAssignments', JSON.stringify(existingAssignments))
    
    setSelectedFacilities([])
    setSelectedPatient("")
  }

  return (
    <PatientContext.Provider value={{
      selectedPatient,
      setSelectedPatient,
      selectedFacilities,
      setSelectedFacilities,
      handleAssignFacilities
    }}>
      {children}
    </PatientContext.Provider>
  )
}

export const usePatient = () => {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider')
  }
  return context
}