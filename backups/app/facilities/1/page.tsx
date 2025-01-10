import { FacilityDetailsComponent } from '@/components/facilities/1/FacilityDetails';
const topAttributes = [
  "24/7 Care",
  "Home-cooked Meals",
  "Beautiful Garden",
  "Daily Activities"
];
export default function FacilityDetailsPage({ params }: { params: { id: string } }) {
  return (
    <FacilityDetailsComponent
      name="Sunshine Care Home"
      location="San Diego, CA"
      beds={20}
      caregivers={10}
      topAttributes={topAttributes}
      description="A warm and welcoming care facility..."
      price={5000}
      images={[/* array of image URLs */]}
    />
  );
}