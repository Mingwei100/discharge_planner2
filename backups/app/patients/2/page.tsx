import { PatientDetailsComponent } from '@/components/patients/1/PatientDetails';
import localImage from '@/assets/sample_rcfe.jpeg'
export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  return (
    <PatientDetailsComponent
      id={2}
      name="Bob Smith"
      age={78}
      gender="Male"
      diagnosis={["Hypertension", "Type 2 Diabetes"]}
      medications={["Lisinopril", "Metformin"]}
      careNeeds={["Assistance with bathing", "Medication management"]}
      notes="Patient is responding well to current treatment plan. Needs regular blood sugar monitoring."
      admissionDate="2023-05-15"
      roomNumber="201"
      image= {localImage}
    />
  );
}