import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
import { facilities } from '@/components/facilities';
import sampleImage from '@/assets/facility_1_1.jpg'
import sampleImage2 from '@/assets/facility_1_2.jpg'
import sampleImage3 from '@/assets/facility_1_3.jpg'
import sampleImage4 from '@/assets/facility_1_4.jpg'
import sampleImage5 from '@/assets/facility_1_5.jpg'

export default function FacilityDetailsPage({ params }: { params: { id: string } }) {
  const facility = facilities.find(f => f.id === 338);
  console.log(parseInt(params.id))
  return (
    <FacilityDetailsComponent
      name={facility.name}
      location="San Diego, CA"
      beds={facility.capacity}
      caregivers={10}
      topAttributes={facility.topAttributes}
      description= {facility.description}
      price={facility.price}
      images={[sampleImage.src,
               sampleImage2.src,
               sampleImage3.src,
               sampleImage4.src,
               sampleImage5.src
      ]}
    />
  );
}