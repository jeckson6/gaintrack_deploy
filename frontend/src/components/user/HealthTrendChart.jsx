import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function HealthTrendChart({ records }) {

  // 🔒 SAFETY: Ensure array
  if (!Array.isArray(records)) {
    return null;
  }

  // ✅ Transform & sanitize data
  const data = records
    .map((r) => ({
      date: r.RecordedDate?.split("T")[0],
      weight: r.Weight_kg ? Number(r.Weight_kg) : null,
      bodyFat: r.BodyFatPercentage !== null
        ? Number(r.BodyFatPercentage)
        : null
    }))
    .filter((r) => r.date && r.weight !== null);

  // ✅ REAL condition (after processing)
  if (data.length < 2) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
        Not enough data to display trends
      </div>
    );

  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        📈 Weight & Body Fat Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />

          <YAxis
            yAxisId="left"
            label={{
              value: "Weight (kg)",
              angle: -90,
              position: "insideLeft"
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Body Fat (%)",
              angle: 90,
              position: "insideRight"
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Weight (kg)"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="bodyFat"
            stroke="#9333ea"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
            name="Body Fat (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
