import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";


const COLORS = ["#4f46e5", "#22c55e", "#f59e0b"];

export default function SystemAnalytics() {
  const [training, setTraining] = useState([]);
  const [gender, setGender] = useState([]);
  const [logs, setLogs] = useState([]);


  useEffect(() => {
    fetch("http://localhost:5000/api/admins/analytics/training")
      .then(res => res.json())
      .then(setTraining);

    fetch("http://localhost:5000/api/admins/dashboard")
      .then(res => res.json())
      .then(d => {
        setGender([
          { name: "Male", value: d.maleCount },
          { name: "Female", value: d.femaleCount },
          { name: "Other", value: d.otherCount }
        ]);

        fetch("http://localhost:5000/api/admins/system-logs")
          .then(res => res.json())
          .then(setLogs);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 System Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Training Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={training}>
              <XAxis dataKey="TrainingMethod" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Gender Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={gender} dataKey="value" label>
                {gender.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Logs */}
        <div className="bg-white p-4 shadow rounded mt-8">
          <h3 className="font-semibold mb-3">🧾 System Logs</h3>

          {logs.length === 0 && (
            <p className="text-sm text-gray-500">No system activities recorded.</p>
          )}

          <ul className="space-y-2 text-sm">
            {logs.map(log => (
              <li
                key={log.LogID}
                className="border-b pb-2 last:border-b-0"
              >
                <span className="text-gray-500">
                  {new Date(log.CreatedAt).toLocaleString()}
                </span>{" "}
                — <b>{log.AdminEmail}</b>{" "}
                <span className="text-indigo-600">
                  {log.Action.replace("_", " ").toLowerCase()}
                </span>{" "}
                <span className="text-gray-700">
                  ({log.Target})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
