import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 80,
  },
  {
    name: "Feb",
    total: 80 * 1.004,
  },
  {
    name: "Mar",
    total: 80 * 1.004,
  },
  {
    name: "Apr",
    total: 80 * 1.004 * (1 - 0.013),
  },
  {
    name: "May",
    total: 80 * 1.004 * (1 - 0.013),
  },
  {
    name: "Jun",
    total: 80 * 1.004 * (1 - 0.013),
  },
  {
    name: "Jul",
    total: 80 * 1.004 * (1 - 0.013) * (1 - 0.007),
  },
  {
    name: "Aug",
    total: 80 * 1.004 * (1 - 0.013) * (1 - 0.007),
  },
  {
    name: "Sep",
    total: 80 * 1.004 * (1 - 0.013) * (1 - 0.007) * 1.01,
  },
  {
    name: "Oct",
    total: 80 * 1.004 * (1 - 0.013) * (1 - 0.007) * 1.01,
  },
  {
    name: "Nov",
    total: 80 * 1.004 * (1 - 0.013) * (1 - 0.007) * 1.01 * (1 - 0.052),
  },
];

export function ForestationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `${value}%`}
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