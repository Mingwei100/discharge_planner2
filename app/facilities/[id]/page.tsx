import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
import { facilities } from '@/components/facilities';
import sampleImage from '@/assets/sample_rcfe.jpeg'
export default function FacilityDetailsPage({ params }: { params: { id: string } }) {
  const facility = facilities.find(f => f.id === parseInt(params.id));
  return (
    <FacilityDetailsComponent
      name={facility.name}
      location="San Diego, CA"
      beds={facility.capacity}
      caregivers={10}
      topAttributes={facility.topAttributes}
      description= {facility.description}
      price={facility.price}
      images={[sampleImage.src]}
    />
  );
}