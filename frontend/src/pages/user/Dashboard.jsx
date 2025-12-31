import React, { useEffect, useState } from "react";
import HealthTrendChart from "../../components/user/HealthTrendChart";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [latest, setLatest] = useState(null);
  const [announcement, setAnnouncement] = useState(null);


  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    if (!user) return;

    // profile (gender)
    fetch(`http://localhost:5000/api/users/profile?userId=${user.user_id}`)
      .then(res => res.json())
      .then(setProfile);

    // health records
    fetch(`http://localhost:5000/api/health?userId=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRecords(data);
          setLatest(data[0]); // newest (DESC order)
        }
      });

    fetch("http://localhost:5000/api/system-config/announcement")
      .then(res => res.json())
      .then(setAnnouncement);
  }, []);

  /* ======================
     HELPERS
  ====================== */

  const badge = (label, color) => {
    const colors = {
      green: "bg-green-100 text-green-700 border-green-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      red: "bg-red-100 text-red-700 border-red-300",
      gray: "bg-gray-100 text-gray-500 border-gray-300"
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${colors[color]}`}
      >
        {label}
      </span>
    );
  };

  const bmiStatus = (bmi) => {
    if (bmi < 18.5) return badge("Underweight", "yellow");
    if (bmi < 25) return badge("Healthy", "green");
    if (bmi < 30) return badge("Above Optimal Range", "yellow");
    return badge("Needs Attention", "red");
  };

  const bodyFatStatus = (bf, gender) => {
    if (!bf || !gender) return badge("—", "gray");

    if (gender === "Male") {
      if (bf <= 20) return badge("Healthy", "green");
      if (bf <= 25) return badge("Above Optimal", "yellow");
      return badge("Needs Attention", "red");
    } else {
      if (bf <= 28) return badge("Healthy", "green");
      if (bf <= 35) return badge("Above Optimal", "yellow");
      return badge("Needs Attention", "red");
    }
  };

  const getTrend = (before, now, unit = "") => {
    if (before == null || now == null) return null;

    const diff = (now - before).toFixed(1);
    const isUp = diff > 0;
    const isDown = diff < 0;

    return {
      before,
      now,
      diff,
      icon: isUp ? "↑" : isDown ? "↓" : "→",
      color: isUp
        ? "text-red-600"
        : isDown
          ? "text-green-600"
          : "text-gray-500",
      unit
    };
  };

  const previous = records.length >= 2 ? records[1] : null;

  const weightTrend =
    previous && latest
      ? getTrend(previous.weight_kg, latest.weight_kg, "kg")
      : null;

  const bodyFatTrend =
    previous && latest
      ? getTrend(
        previous.body_fat_percentage,
        latest.body_fat_percentage,
        "%"
      )
      : null;

  /* ======================
     UI
  ====================== */

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>

        {/* SYSTEM ANNOUNCEMENT */}
        {announcement?.config_value && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg shadow-sm">
            📢 <span className="font-medium">Announcement:</span>{" "}
            {announcement.config_value}
          </div>
        )}

        <p className="text-gray-600">
          Here’s a quick overview of your health status
        </p>
      </div>

      {/* EMPTY STATE */}
      {!latest ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500 text-lg">
            📊 No health data available yet
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Add your first health record to see insights here.
          </p>
        </div>
      ) : (
        <>
          {/* ANALYSIS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BMI */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">BMI Analysis</h2>
              <p className="text-3xl font-bold mb-3">{latest.bmi}</p>
              {bmiStatus(latest.bmi)}
              <p className="text-sm text-gray-500 mt-3">
                Body Mass Index based on your height and weight.
              </p>
            </div>

            {/* BODY FAT */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">
                Body Fat Analysis
              </h2>
              <p className="text-3xl font-bold mb-3">
                {latest.body_fat_percentage
                  ? `${latest.body_fat_percentage}%`
                  : "—"}
              </p>
              {bodyFatStatus(
                latest.body_fat_percentage,
                profile?.user_gender
              )}
              <p className="text-sm text-gray-500 mt-3">
                Estimated using BMI, age, and gender.
              </p>
            </div>
          </div>

          {/* BEFORE → NOW */}
          {records.length >= 2 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                📈 Progress Comparison
              </h2>

              <div className="space-y-4">
                {/* WEIGHT */}
                {weightTrend && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Weight</span>

                    <div className="flex items-center gap-3">
                      <span>{weightTrend.before} kg</span>
                      <span className="text-gray-400">→</span>
                      <span>{weightTrend.now} kg</span>

                      <span className={`font-semibold ${weightTrend.color}`}>
                        {weightTrend.icon} {weightTrend.diff} kg
                      </span>
                    </div>
                  </div>
                )}


                {/* BODY FAT */}
                {bodyFatTrend && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Body Fat</span>
                    <div className="flex items-center gap-3">
                      <span>{bodyFatTrend.before}%</span>
                      <span className="text-gray-400">→</span>
                      <span>{bodyFatTrend.now}%</span>
                      <span
                        className={`font-semibold ${bodyFatTrend.color}`}
                      >
                        {bodyFatTrend.icon} {bodyFatTrend.diff}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TREND CHART */}
          {records.length >= 2 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <HealthTrendChart records={[...records].reverse()} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
