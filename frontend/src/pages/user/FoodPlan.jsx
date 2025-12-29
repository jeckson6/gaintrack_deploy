import React, { useEffect, useState } from "react";
import FoodPlanCard from "../../components/user/FoodPlanCard";

export default function FoodPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plan, setPlan] = useState(null);
  const [day, setDay] = useState("Monday");

  useEffect(() => {
    fetch(`http://localhost:5000/api/food-plan/latest?userId=${user.UserID}`)
      .then(res => res.json())
      .then(setPlan);
  }, []);

  if (!plan) return <p>No food plan found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🥗 Food Plan</h1>

      <div className="flex gap-2 mb-6">
        {Object.keys(plan.weeklyMeals).map(d => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`px-3 py-1 rounded ${
              day === d ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plan.weeklyMeals[day].map((meal, i) => (
          <FoodPlanCard key={i} meal={meal} />
        ))}
      </div>
    </div>
  );
}
