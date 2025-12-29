import React, { useEffect, useState } from "react";
import TrainingTable from "../../components/TrainingTable";
import { generateCalendarLink } from "../../components/user/TrainingCalendar";

export default function TrainingPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/training-plan/latest?userId=${user.UserID}`
    )
      .then((res) => res.json())
      .then(setPlan);
  }, []);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading training plan...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ======================
          HEADER
      ====================== */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            🏋️ Your Training Plan
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Stay consistent and track your workouts
          </p>
        </div>

        <a
          href={generateCalendarLink(plan.trainingPlan)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-indigo-50 transition text-sm"
        >
          📅 Add to Calendar
        </a>
      </div>

      {/* ======================
          PLAN META
      ====================== */}
      <div className="flex flex-wrap gap-3 text-sm">
        <MetaBadge label="Plan Type" value={plan.planType} />
        <MetaBadge
          label="Training Method"
          value={plan.trainingMethod}
        />
        <MetaBadge
          label="Generated On"
          value={new Date(plan.createdAt).toDateString()}
        />
      </div>

      {/* ======================
          TRAINING TABLE
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          📋 Weekly Training Schedule
        </h2>

        <TrainingTable trainingPlan={plan.trainingPlan} />
      </div>
    </div>
  );
}

/* ======================
   META BADGE
====================== */
function MetaBadge({ label, value }) {
  return (
    <div className="bg-gray-100 border rounded-lg px-3 py-1 text-gray-700">
      <span className="text-xs text-gray-500 mr-1">
        {label}:
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
