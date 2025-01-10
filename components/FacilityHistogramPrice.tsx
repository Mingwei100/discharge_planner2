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

interface FacilityHistogramPriceProps {
  facilities: any[];
  currentFacility: any;
}

export function FacilityHistogramPrice({ facilities, currentFacility }: FacilityHistogramPriceProps) {
  // Create price bins (every $1000)
  const binSize = 1000;
  const maxPrice = Math.ceil(Math.max(...facilities.map(f => f.price)) / binSize) * binSize;
  const bins = Array.from({ length: maxPrice / binSize }, (_, i) => ({
    range: `$${i * binSize}-${(i + 1) * binSize}`,
    count: 0,
    isCurrentFacility: false,
  }));

  // Count facilities in each bin
  facilities.forEach(facility => {
    const binIndex = Math.floor(facility.price / binSize);
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  });

  // Mark current facility's bin
  const currentBinIndex = Math.floor(currentFacility.price / binSize);
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
            label={{ value: "Price Range", position: "bottom", offset: 0 }}
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