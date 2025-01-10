import { PatientDetailsComponent } from '@/components/patients/1/PatientDetails';
import localImage from '@/assets/frank_miller.jpg'
import { patients } from '@/components/patients';

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const patient = patients.find(p => p.id === 6);
  
  if (!patient) {
    return <div>Patient not found, we have {params.id}</div>;
  }

  return (
    <PatientDetailsComponent
      id={patient.id}
      name={patient.name}
      age={patient.age} // Note: Age is not in the patients data, keeping hardcoded value
      gender={patient.gender}
      diagnosis={patient.diagnosis}
      medications={patient.medications}
      careNeeds={patient.careNeeds}
      notes={patient.notes}
      admissionDate={patient.admissionDate}
      roomNumber={patient.roomNumber}
      image={localImage}
    />
  );
}