import React, { useEffect, useState } from "react";
import KPIStatCard from "../../components/common/KPIStatCard";
import FoodPlanCard from "../../components/user/FoodPlanCard";
import TrainingTable from "../../components/TrainingTable";
import { generateCalendarLink } from "../../components/user/TrainingCalendar";


export default function AIAssistant() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [health, setHealth] = useState(null);
  const [goal, setGoal] = useState("");
  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainingStyle, setTrainingStyle] = useState("");
  const [trainingDays, setTrainingDays] = useState(4);
  const calendarLink = generateCalendarLink(aiResult?.trainingPlan);


  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/ai/health-summary?userId=${user.UserID}`
    )
      .then(res => res.json())
      .then(setHealth);
  }, []);

  const analyzeHealth = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        goal,
        trainingStyle,
        trainingDays
      })
    });

    const data = await res.json();
    setAIResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🤖 GainTrack AI Assistant</h1>

      {health && (
        <>
          <p className="mb-4 text-gray-600">
            Gender: <strong>{health.gender}</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <KPIStatCard title="Height" value={`${health.Height_cm} cm`} />
            <KPIStatCard title="Weight" value={`${health.Weight_kg} kg`} />
            <KPIStatCard title="BMI" value={health.BMI} />
            <KPIStatCard
              title="Body Fat"
              value={`${health.BodyFatPercentage}%`}
            />
          </div>
        </>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
        ${selectedDay === day
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
      `}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <select
          className="w-full border p-3 rounded mb-4"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">Choose goal</option>
          <option value="Bulking">Bulking</option>
          <option value="Maintain">Maintain</option>
          <option value="Cutting">Cutting</option>
        </select>

        <select
          className="w-full border p-3 rounded mb-4"
          value={trainingStyle}
          onChange={(e) => setTrainingStyle(e.target.value)}
        >
          <option value="">Training Style</option>
          <option value="ppl">Push / Pull / Legs</option>
          <option value="upper_lower">Upper / Lower</option>
          <option value="full_body">Full Body</option>
        </select>

        <select
          className="w-full border p-3 rounded mb-4"
          value={trainingDays}
          onChange={(e) => setTrainingDays(Number(e.target.value))}
        >
          <option value={3}>3 days / week</option>
          <option value={4}>4 days / week</option>
          <option value={5}>5 days / week</option>
          <option value={6}>6 days / week</option>
        </select>


        <button
          onClick={analyzeHealth}
          disabled={!goal || loading}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Health"}
        </button>
      </div>

      {/* FOOD PLAN */}
      {aiResult?.weeklyMeals?.[selectedDay] && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiResult.weeklyMeals[selectedDay].map((meal, i) => (
            <FoodPlanCard key={i} meal={meal} />
          ))}
        </div>
      )}


      {/* TRAINING PLAN */}
      {aiResult?.trainingPlan && (
        <div className="mt-12 bg-white p-6 rounded-lg shadow max-w-xl">

          {/* Title + ONE Calendar Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🏋️ Training Plan</h2>

            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border rounded"
            >
              Add to Calendar
            </a>
          </div>

          {/* Training list only */}
          <TrainingTable trainingPlan={aiResult.trainingPlan} />
        </div>
      )}

    </div>
  );
}
