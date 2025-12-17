import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "12 dec", revenue: 8200, orders: 4200 },
  { day: "13 dec", revenue: 9100, orders: 3900 },
  { day: "14 dec", revenue: 8800, orders: 4500 },
  { day: "15 dec", revenue: 12000, orders: 6200 },
  { day: "16 dec", revenue: 10200, orders: 5300 },
  { day: "17 dec", revenue: 9400, orders: 4800 },
  { day: "18 dec", revenue: 11000, orders: 5600 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
