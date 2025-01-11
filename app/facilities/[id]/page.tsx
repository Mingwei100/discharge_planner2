import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
import { facilities } from '@/components/facilities';
import sampleImage from '@/assets/sample_rcfe.jpeg'
import localImage1 from '@/assets/facility_1_1.JPG'
import localImage2 from '@/assets/facility_1_2.JPG'
import localImage3 from '@/assets/facility_1_3.JPG'
import localImage4 from '@/assets/facility_1_4.JPG'
import localImage5 from '@/assets/facility_1_5.JPG'

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
      images={[sampleImage.src,localImage1.src,localImage2.src,localImage3.src,localImage4.src]}
    />
  );
}
