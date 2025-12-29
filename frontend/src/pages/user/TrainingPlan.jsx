import React, { useEffect, useState } from "react";
import TrainingTable from "../../components/TrainingTable";
import { generateCalendarLink } from "../../components/user/TrainingCalendar";

export default function TrainingPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/training-plan/latest?userId=${user.UserID}`)
      .then(res => res.json())
      .then(setPlan);
  }, []);

  if (!plan) return <p>Loading training plan...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🏋️ Training Plan</h1>

        <a
          href={generateCalendarLink(plan.trainingPlan)}
          target="_blank"
          rel="noopener noreferrer"
          className="border px-3 py-1 rounded text-sm"
        >
          📅 Add to Calendar
        </a>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {plan.planType} • {plan.trainingMethod} •{" "}
        {new Date(plan.createdAt).toDateString()}
      </p>

      <TrainingTable trainingPlan={plan.trainingPlan} />
    </div>
  );
}
