import React, { useEffect, useState } from "react";
import HealthChart from "../../components/user/HealthChart";

export default function HealthRecords() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    weight: "",
    height: "",
    manualBodyFat: "",
    recordedDate: ""
  });

  /* ======================
     HELPERS
  ====================== */
  const gender = profile?.Gender;
  const dateOfBirth = profile?.DateOfBirth;

  const firstRecordHeight =
  records.length > 0 ? records[records.length - 1].Height_cm : null;

  const hasHeight = !!firstRecordHeight;
  const effectiveHeight = hasHeight ? firstRecordHeight : form.height;

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

  const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return "";
    const h = heightCm / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const calculatedBMI = calculateBMI(form.weight, effectiveHeight);

  const estimateBodyFat = (bmi, age, gender) => {
    if (!bmi || !age || !gender) return "";
    const g = gender === "Male" ? 1 : 0;
    return (1.2 * bmi + 0.23 * age - 10.8 * g - 5.4).toFixed(1);
  };

  const estimatedBodyFat =
    calculatedBMI && age && gender
      ? estimateBodyFat(calculatedBMI, age, gender)
      : "";

  const finalBodyFat =
    form.manualBodyFat !== ""
      ? form.manualBodyFat
      : estimatedBodyFat;

  /* ======================
     FETCH DATA
  ====================== */
  const refreshRecords = async () => {
    const res = await fetch(
      `http://localhost:5000/api/health?userId=${user.UserID}`
    );
    setRecords(await res.json());
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/profile?userId=${user.UserID}`
        );
        if (res.ok) setProfile(await res.json());
      } catch { }

      refreshRecords();
    };

    loadData();
  }, []);

  /* ======================
     ADD RECORD
  ====================== */
  const handleAddRecord = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        weight: form.weight,
        height: form.height,
        bmi: calculatedBMI,
        bodyFat: finalBodyFat,
        recordedDate: form.recordedDate
      })
    });

    if (!res.ok) {
      alert("Failed to add record");
      return;
    }

    setForm({
      weight: "",
      height: "",
      manualBodyFat: "",
      recordedDate: ""
    });

    refreshRecords();
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">🩺 Health Records</h1>
        <p className="text-gray-600">
          Track your progress and understand your body metrics
        </p>
      </div>

      {/* CHART */}
      {records.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <HealthChart records={records} />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          📅 Record History
        </h2>

        <div className="max-h-[300px] overflow-y-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 uppercase text-xs">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Weight (kg)</th>
                <th className="p-3 text-center">BMI</th>
                <th className="p-3 text-center">Body Fat %</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.RecordID}
                  className="border-t text-center hover:bg-gray-50"
                >
                  <td className="p-3 text-left">
                    {r.RecordedDate.split("T")[0]}
                  </td>
                  <td className="p-3">{r.Weight_kg}</td>
                  <td className="p-3">{r.BMI}</td>
                  <td className="p-3">{r.BodyFatPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          ➕ Add New Health Record
        </h2>

        <form
          onSubmit={handleAddRecord}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="date"
            className="border p-2 rounded md:col-span-2"
            value={form.recordedDate}
            onChange={(e) =>
              setForm({ ...form, recordedDate: e.target.value })
            }
            required
          />

          {/* ======================
    BASE PROFILE METRICS
====================== */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={firstRecordHeight || form.height || ""}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Baseline value
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={age ? `${age} years` : "—"}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                {!age && (
                  <p className="text-xs text-gray-500 mt-1">
                    Requires date of birth
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  value={gender || "—"}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                {!gender && (
                  <p className="text-xs text-gray-500 mt-1">
                    Set in profile
                  </p>
                )}
              </div>

            </div>
          </div>


          <div className="flex justify-center">
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="border p-2 w-full rounded"
                  value={form.weight}
                  onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                  }
                  required
                />
              </div>


            </div>
          </div>



          {/* CALCULATIONS */}
          {form.weight && effectiveHeight && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <MetricCard
                label="BMI"
                value={calculatedBMI}
                color="blue"
              />

              <MetricCard
                label={`Body Fat % ${form.manualBodyFat ? "(Manual)" : "(Estimated)"
                  }`}
                value={finalBodyFat ? `${finalBodyFat}%` : "--"}
                color="purple"
              />

              <input
                type="number"
                step="0.1"
                placeholder="Manual body fat % (optional)"
                className="border p-2 rounded md:col-span-2"
                value={form.manualBodyFat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    manualBodyFat: e.target.value
                  })
                }
              />

              <p className="text-xs text-gray-500 text-center md:col-span-2">
                Values are automatically calculated to help users who are
                unfamiliar with manual formulas.
              </p>
            </div>
          )}

          <button className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Save Health Record
          </button>
        </form>
      </div>
    </div>
  );
}

/* ======================
   METRIC CARD
====================== */
function MetricCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700"
  };

  return (
    <div
      className={`border rounded p-4 text-center ${colors[color]}`}
    >
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
