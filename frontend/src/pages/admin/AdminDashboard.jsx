import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admins/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  const genderData = [
    { name: "Male", value: data.maleCount },
    { name: "Female", value: data.femaleCount },
    { name: "Other", value: data.otherCount }
  ];

  const userStatus = [
    { name: "Active", value: data.activeUsers },
    { name: "Inactive", value: data.inactiveUsers }
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Total Users" value={data.totalUsers} />
        <KPI title="Active Users" value={data.activeUsers} />
        <KPI title="AI Food Plans" value={data.totalFoodPlans} />
        <KPI title="Training Plans" value={data.totalTrainingPlans} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Gender Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} dataKey="value" label>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="User Status">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userStatus}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
