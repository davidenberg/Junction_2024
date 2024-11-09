import { AreaCoverage, SatelliteImageData } from '@/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ForestationChartProps {
  data: {
    [key: string]: SatelliteImageData;
  };
  coverage: AreaCoverage[];
}
export function ForestationChart({ data, coverage }: ForestationChartProps) {
  const formattedData = Object.keys(data).map((key) => ({
    name: key,
    total: Number(coverage.find((e) => e.date === key)?.coverage?.replace('%', ''))
  }));

  const minVal = Math.min.apply(null, formattedData.map((e) => e.total));
  const yMin = minVal - 20;
  const yTickCount = Math.floor((100 - yMin) / 5);
  const yCount = Math.floor((100 - yMin) / yTickCount);
  const yTicks = Array.from({ length: yTickCount }, (_, i) => 100 - (yCount - i - 1) * yTickCount);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formattedData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.substring(0, 10)}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
          domain={[yMin, 100]}
          ticks={yTicks}
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