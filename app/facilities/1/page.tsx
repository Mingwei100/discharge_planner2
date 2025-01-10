import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
import { facilities } from '@/components/facilities';
const topAttributes = [
  "24/7 Care",
  "Home-cooked Meals",
  "Beautiful Garden",
  "Daily Activities"
];
export default function FacilityDetailsPage({ params }: { params: { id: string } }) {
  const facility = facilities.find(f => f.id === 1)
  return (
    <FacilityDetailsComponent
      name={facility.name}
      location="San Diego, CA"
      beds={facility.capacity}
      caregivers={10}
      topAttributes={topAttributes}
      description="A warm and welcoming care facility..."
      price={5000}
      images={[/* array of image URLs */]}
    />
  );
}