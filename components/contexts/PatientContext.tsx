"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface PatientContextType {
  selectedPatient: string
  setSelectedPatient: (id: string) => void
  selectedFacilities: string[]
  setSelectedFacilities: (facilities: string[]) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])


  return (
    <PatientContext.Provider value={{
      selectedPatient,
      setSelectedPatient,
      selectedFacilities,
      setSelectedFacilities,
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