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
} from "recharts";

/* -------------------- DATA -------------------- */

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
  { name: "Electronics", value: 1200000 },
  { name: "Fashion", value: 950000 },
  { name: "Clothing", value: 750000 },
  { name: "Beauty & Personal Care", value: 500000 },
];

const trafficData = [
  { name: "Direct", value: 40 },
  { name: "Organic Search", value: 30 },
  { name: "Social Media", value: 15 },
  { name: "Referral", value: 10 },
  { name: "Email Campaigns", value: 5 },
];

const COLORS = ["#FF9F43", "#FFD8A8", "#FFE8CC", "#FFF1E6"];
const TOTAL_CATEGORY_VALUE = categoryData.reduce((a, b) => a + b.value, 0);

/* -------------------- COMPONENT -------------------- */

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      {/* ================= TOP STATS ================= */}
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

      {/* ================= MIDDLE GRID ================= */}
      <div className="middle-grid">

        {/* Revenue Analytics */}
        <div className="card large">
          <div className="card-header">
            <h3>Revenue Analytics</h3>
            <button className="chip">Last 8 Days</button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF9F43"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#FFD8A8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Target */}
        <div className="card monthly-target">
          <h3>Monthly Target</h3>

          <div className="donut-wrapper">
            <PieChart width={220} height={220}>
              <Pie
                data={[{ value: 85 }, { value: 15 }]}
                innerRadius={80}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#FF9F43" />
                <Cell fill="#FFE8CC" />
              </Pie>
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
            Let’s reach 100% next month.
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

        {/* Top Categories */}
        <div className="card top-categories">
          <h3>Top Categories</h3>

          <div className="donut-wrapper">
            <PieChart width={220} height={220}>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={80}
                outerRadius={100}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
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
                  <i style={{ background: COLORS[i] }} />
                  {c.name}
                </span>
                <strong>${c.value.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className="bottom-grid">

        {/* Active Users */}
        <div className="card active-users">
          <h3>Active Users</h3>

          {[
            { country: "United States", value: 36 },
            { country: "United Kingdom", value: 24 },
            { country: "India", value: 18 },
            { country: "Others", value: 22 },
          ].map((item) => (
            <div className="user-row" key={item.country}>
              <div className="user-info">
                <span>{item.country}</span>
                <span className="percent">{item.value}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Conversion Funnel */}
        <div className="card">
          <h3>Conversion Funnel</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: "Views", value: 25000 },
                { name: "Add to Cart", value: 12000 },
                { name: "Checkout", value: 8500 },
                { name: "Completed", value: 6200 },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF9F43" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="card">
          <h3>Traffic Sources</h3>
          <ul className="list">
            {trafficData.map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <strong>{t.value}%</strong>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
