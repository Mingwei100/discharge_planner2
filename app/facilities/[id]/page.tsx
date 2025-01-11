import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
import { facilities } from '@/components/facilities';
import sampleImage from '@/assets/sample_rcfe.jpeg'
import localImage1 from '@/assets/facility_1_1.JPG'
import localImage2 from '@/assets/facility_1_2.JPG'
import localImage2 from '@/assets/facility_1_3.JPG'
import localImage2 from '@/assets/facility_1_4.JPG'
import localImage2 from '@/assets/facility_1_5.JPG'

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
      images={[sampleIage.src,localImage1.src]}
    />
  );
}