import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell
} from "recharts"
import { Card } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"

interface FacilityHistogramProps {
  facilities: any[];
  currentFacility: any;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

export function FacilityHistogram({ facilities, currentFacility }: FacilityHistogramProps) {
  // Calculate distances using the same formula
  const facilitiesWithDistances = facilities.map(facility => ({
    ...facility,
    distance: getDistance(currentFacility.lat, currentFacility.lng, facility.lat, facility.lng)
  }));

  // Create distance bins
  const binSize = 5;
  const maxDistance = Math.ceil(Math.max(...facilitiesWithDistances.map(f => f.distance)) / binSize) * binSize;
  const bins = Array.from({ length: maxDistance / binSize }, (_, i) => ({
    range: `${i * binSize}-${(i + 1) * binSize}`,
    count: 0,
    isCurrentFacility: false,
  }));

  // Count facilities in each bin
  facilitiesWithDistances.forEach(facility => {
    const binIndex = Math.floor(facility.distance / binSize);
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  });

  // Mark current facility's bin
  const currentBinIndex = Math.floor(currentFacility.distance / binSize);
  if (bins[currentBinIndex]) {
    bins[currentBinIndex].isCurrentFacility = true;
  }

  return (
    <Card className="pt-6">
      <ResponsiveContainer width="100%" height={120}>
        <BarChart 
          data={bins}
          margin={{ left: 0, right: 40, top: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="range"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: "Distance Range", position: "bottom", offset: 0 }}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
          >
            {bins.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isCurrentFacility ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)"}
              />
            ))}
          </Bar>
          <ChartTooltip />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}