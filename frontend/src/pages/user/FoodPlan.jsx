import React, { useEffect, useState } from "react";
import FoodPlanCard from "../../components/user/FoodPlanCard";

export default function FoodPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plan, setPlan] = useState(null);
  const [day, setDay] = useState("Monday");

  const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];


  useEffect(() => {
    fetch(
      `http://localhost:5000/api/food-plan/latest?userId=${user.user_id}`
    )
      .then((res) => res.json())
      .then(setPlan);
  }, []);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
       Food Plan haven't generated yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ======================
          HEADER
      ====================== */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold">🥗 Your Food Plan</h1>
        <p className="text-sm opacity-90 mt-1">
          Personalized meals to support your fitness goals
        </p>
      </div>

      {/* ======================
          DAY SELECTOR
      ====================== */}
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Select a day to view meals
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
         {DAYS_ORDER.filter((d) => plan.weeklyMeals[d]).map((d) => (
  <button
    key={d}
    onClick={() => setDay(d)}
    className={`
      px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition
      ${
        day === d
          ? "bg-green-600 text-white shadow"
          : "bg-gray-200 hover:bg-gray-300"
      }
    `}
  >
    {d}
  </button>
))}
        </div>
      </div>

      {/* ======================
          DAY INFO
      ====================== */}
      <div className="text-sm text-gray-600">
        Showing meals for{" "}
        <span className="font-medium text-gray-800">
          {day}
        </span>
      </div>

      {/* ======================
          MEAL CARDS
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plan.weeklyMeals[day].map((meal, i) => (
          <FoodPlanCard key={i} meal={meal} />
        ))}
      </div>
    </div>
  );
}
