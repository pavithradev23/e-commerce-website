import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Completed", value: 85 },
  { name: "Remaining", value: 15 },
];

const COLORS = ["#f59e0b", "#e5e7eb"];

export default function TargetChart() {
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        fontWeight="600"
      >
        85%
      </text>
    </PieChart>
  );
}
