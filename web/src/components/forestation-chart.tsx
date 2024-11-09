import { SatelliteImageData } from '@/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ForestationChartProps {
  data: {
    [key: string]: SatelliteImageData;
  };
}
export function ForestationChart({ data }: ForestationChartProps) {
  const formattedData = Object.keys(data).map((key) => ({
    name: key,
    total: data[key].forestationRate
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formattedData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value * 100}%`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-green-700"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}