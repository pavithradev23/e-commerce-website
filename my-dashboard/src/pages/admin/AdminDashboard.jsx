import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const revenueData = [
  { name: "12 Aug", revenue: 8200, orders: 4200 },
  { name: "13 Aug", revenue: 9100, orders: 4800 },
  { name: "14 Aug", revenue: 8800, orders: 4600 },
  { name: "15 Aug", revenue: 10200, orders: 5200 },
  { name: "16 Aug", revenue: 14521, orders: 8600 },
  { name: "17 Aug", revenue: 11000, orders: 6100 },
  { name: "18 Aug", revenue: 9800, orders: 5400 },
  { name: "19 Aug", revenue: 12100, orders: 6900 },
];

const categoryData = [
  { name: "Electronics", value: 1200000, color: "#4F46E5" },
  { name: "Fashion", value: 950000, color: "#10B981" },
  { name: "Clothing", value: 750000, color: "#F59E0B" },
  { name: "Beauty & Personal Care", value: 500000, color: "#EF4444" },
];

const trafficData = [
  { name: "Direct", value: 40, color: "#4F46E5" },
  { name: "Organic Search", value: 30, color: "#10B981" },
  { name: "Social Media", value: 15, color: "#F59E0B" },
  { name: "Referral", value: 10, color: "#EF4444" },
  { name: "Email Campaigns", value: 5, color: "#8B5CF6" },
];

const TOTAL_CATEGORY_VALUE = categoryData.reduce((a, b) => a + b.value, 0);


const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-item" style={{ color: "#FF9F43" }}>
          Revenue: <strong>${payload[0].value.toLocaleString()}</strong>
        </p>
        <p className="tooltip-item" style={{ color: "#FFD8A8" }}>
          Orders: <strong>{payload[1].value.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const CustomCategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / TOTAL_CATEGORY_VALUE) * 100).toFixed(1);
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p>
          Revenue: <strong>${data.value.toLocaleString()}</strong>
        </p>
        <p>
          Percentage: <strong>{percentage}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p>
          Value: <strong>{payload[0].value.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
 
  const targetData = [
    { name: "Achieved", value: 85, color: "#10B981" },
    { name: "Remaining", value: 15, color: "#E5E7EB" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card highlight">
          <p>Total Sales</p>
          <h2>$983,410</h2>
          <span className="positive">+3.4% from last week</span>
        </div>

        <div className="stat-card">
          <p>Total Orders</p>
          <h2>58,375</h2>
          <span className="negative">-2.8% from last week</span>
        </div>

        <div className="stat-card">
          <p>Total Visitors</p>
          <h2>237,782</h2>
          <span className="positive">+8.0% from last week</span>
        </div>

        <div className="stat-card">
          <p>Conversion Rate</p>
          <h2>2.45%</h2>
          <span className="positive">+1.2%</span>
        </div>
      </div>

      <div className="middle-grid">
        <div className="card large">
          <div className="card-header">
            <h3>Revenue Analytics</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#FF9F43" }} />
                Revenue
              </span>
              <span className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#FFD8A8" }} />
                Orders
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF9F43"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6, fill: "#FF9F43" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#FFD8A8"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 5, fill: "#FFD8A8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card monthly-target">
          <div className="card-header">
            <h3>Monthly Target</h3>
            <div className="progress-legend">
              <span className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#10B981" }} />
                Achieved
              </span>
              <span className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#E5E7EB" }} />
                Remaining
              </span>
            </div>
          </div>

          <div className="donut-wrapper">
            <PieChart width={220} height={220}>
              <Pie
                data={targetData}
                innerRadius={80}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
              >
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, "Progress"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
            </PieChart>

            <div className="donut-center">
              <h2>85%</h2>
              <p className="positive">+8.02%</p>
              <span>from last month</span>
            </div>
          </div>

          <p className="target-text">Great Progress!</p>
          <p className="muted">
            Our achievement increased by <strong>$200,000</strong>.  
            Let's reach 100% next month.
          </p>

          <div className="target-footer">
            <div>
              <span>Target</span>
              <strong>$600,000</strong>
            </div>
            <div>
              <span>Revenue</span>
              <strong>$510,000</strong>
            </div>
          </div>
        </div>

        <div className="card top-categories">
          <h3>Top Categories</h3>

          <div className="donut-wrapper">
            <PieChart width={220} height={220}>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={2}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomCategoryTooltip />} />
            </PieChart>

            <div className="donut-center">
              <span className="muted">Total Sales</span>
              <h2>${(TOTAL_CATEGORY_VALUE / 1_000_000).toFixed(1)}M</h2>
            </div>
          </div>

          <ul className="legend-list">
            {categoryData.map((c, i) => (
              <li key={c.name}>
                <span>
                  <i style={{ background: c.color }} />
                  {c.name}
                </span>
                <strong>${c.value.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card active-users">
          <h3>Active Users</h3>

          {[
            { country: "United States", value: 36, color: "#4F46E5" },
            { country: "United Kingdom", value: 24, color: "#10B981" },
            { country: "India", value: 18, color: "#F59E0B" },
            { country: "Others", value: 22, color: "#8B5CF6" },
          ].map((item) => (
            <div className="user-row" key={item.country}>
              <div className="user-info">
                <span>{item.country}</span>
                <span className="percent">{item.value}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Conversion Funnel</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: "Views", value: 25000, color: "#4F46E5" },
                { name: "Add to Cart", value: 12000, color: "#10B981" },
                { name: "Checkout", value: 8500, color: "#F59E0B" },
                { name: "Completed", value: 6200, color: "#EF4444" },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                fill="#4F46E5"
              >
                {[
                  { name: "Views", value: 25000, color: "#4F46E5" },
                  { name: "Add to Cart", value: 12000, color: "#10B981" },
                  { name: "Checkout", value: 8500, color: "#F59E0B" },
                  { name: "Completed", value: 6200, color: "#EF4444" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Traffic Sources</h3>
          <ul className="list">
            {trafficData.map((t) => (
              <li key={t.name}>
                <span>
                  <i style={{ background: t.color }} />
                  {t.name}
                </span>
                <strong>{t.value}%</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}