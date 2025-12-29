import React, { useEffect, useState } from "react";
import KPIStatCard from "../../components/common/KPIStatCard";
import FoodPlanCard from "../../components/user/FoodPlanCard";
import TrainingTable from "../../components/TrainingTable";
import { generateCalendarLink } from "../../components/user/TrainingCalendar";

export default function AIAssistant() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [health, setHealth] = useState(null);
  const [goal, setGoal] = useState("");
  const [trainingStyle, setTrainingStyle] = useState("");
  const [trainingDays, setTrainingDays] = useState(4);

  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
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

  const calendarLink = generateCalendarLink(aiResult?.trainingPlan);

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ======================
          HEADER
      ====================== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow">
        <h1 className="text-3xl font-bold">
          🤖 GainTrack AI Assistant
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Personalized training & nutrition powered by your health data
        </p>
      </div>

      {/* ======================
          HEALTH SNAPSHOT
      ====================== */}
      {health && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            📊 Health Snapshot
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPIStatCard title="Height" value={`${health.Height_cm} cm`} />
            <KPIStatCard title="Weight" value={`${health.Weight_kg} kg`} />
            <KPIStatCard title="BMI" value={health.BMI} />
            <KPIStatCard
              title="Body Fat"
              value={`${health.BodyFatPercentage}%`}
            />
          </div>
        </div>
      )}

      {/* ======================
          AI PREFERENCES
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          ⚙️ AI Preferences
        </h2>

        <select
          className="w-full border p-3 rounded mb-3"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">Select goal</option>
          <option value="Bulking">Bulking</option>
          <option value="Maintain">Maintain</option>
          <option value="Cutting">Cutting</option>
        </select>

        <select
          className="w-full border p-3 rounded mb-3"
          value={trainingStyle}
          onChange={(e) => setTrainingStyle(e.target.value)}
        >
          <option value="">Training style</option>
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
          disabled={!goal || !trainingStyle || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
        >
          {loading ? "Analyzing with AI..." : "Generate AI Plan"}
        </button>
      </div>

      {/* ======================
          FOOD PLAN
      ====================== */}
      {aiResult?.weeklyMeals && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            🍽️ AI Food Plan
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full text-sm
                  ${
                    selectedDay === day
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiResult.weeklyMeals[selectedDay]?.map((meal, i) => (
              <FoodPlanCard key={i} meal={meal} />
            ))}
          </div>
        </div>
      )}

      {/* ======================
          TRAINING PLAN
      ====================== */}
      {aiResult?.trainingPlan && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              🏋️ AI Training Plan
            </h2>

            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              📅 Add to Calendar
            </a>
          </div>

          <TrainingTable trainingPlan={aiResult.trainingPlan} />
        </div>
      )}
    </div>
  );
}
