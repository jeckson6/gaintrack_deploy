import React, { useEffect, useState } from "react";
import HealthChart from "../../components/user/HealthChart";

/* ======================
   METRIC CARD
====================== */
function MetricCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700"
  };

  return (
    <div className={`border rounded p-4 text-center ${colors[color]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function HealthRecords() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    weight: "",
    height: "",
    manualBodyFat: "",
    recordedDate: ""
  });

  /* ======================
     HEIGHT LOCK STATE
  ====================== */
  const [lockedHeight, setLockedHeight] = useState(null);
  const canEditHeight = lockedHeight === null;
  const effectiveHeight = canEditHeight ? form.height : lockedHeight;

  /* ======================
     HELPERS
  ====================== */
  const gender = profile?.user_gender;
  const dateOfBirth = profile?.user_date_of_birth;

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
 const calculatedBMI = calculateBMI(form.weight, effectiveHeight);
  /* ======================
     BUSINESS LOGIC
  ====================== */
  const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return "";
    const h = heightCm / 100;
    return (weight / (h * h)).toFixed(1);
  };


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
    form.manualBodyFat !== "" ? form.manualBodyFat : estimatedBodyFat;

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    if (!form.recordedDate) {
      setMessage({ type: "error", text: "Please select a date." });
      return false;
    }

    if (canEditHeight) {
      if (!form.height) {
        setMessage({
          type: "error",
          text: "Height is required for the first record."
        });
        return false;
      }

      if (form.height < 50 || form.height > 300) {
        setMessage({
          type: "error",
          text: "Height must be between 50–300 cm."
        });
        return false;
      }
    }

    if (!form.weight) {
      setMessage({ type: "error", text: "Weight is required." });
      return false;
    }

    if (form.weight < 20 || form.weight > 500) {
      setMessage({
        type: "error",
        text: "Weight must be between 20–500 kg."
      });
      return false;
    }

    if (
      form.manualBodyFat &&
      (form.manualBodyFat < 2 || form.manualBodyFat > 70)
    ) {
      setMessage({
        type: "error",
        text: "Body fat percentage must be between 2–70%."
      });
      return false;
    }

    return true;
  };

  /* ======================
     FETCH DATA
  ====================== */
  const refreshRecords = async () => {
    const res = await fetch(
      `http://localhost:5000/api/health?userId=${user.user_id}`
    );
    const data = await res.json();

    setRecords(data);

    // 🔒 Find FIRST non-null height (baseline)
    const firstHeightRecord = data.find(
      (r) => r.height_cm !== null && r.height_cm !== undefined
    );

    if (firstHeightRecord) {
      setLockedHeight(Number(firstHeightRecord.height_cm));
    } else {
      setLockedHeight(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/profile?userId=${user.user_id}`
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
    setMessage(null);

    if (!validateForm()) return;

    const res = await fetch("http://localhost:5000/api/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.user_id,
        weight: form.weight,
        height: effectiveHeight,
        bmi: calculatedBMI,
        bodyFat: finalBodyFat,
        recordedDate: form.recordedDate
      })
    });

    if (!res.ok) {
      setMessage({ type: "error", text: "Failed to save health record." });
      return;
    }

    setForm({
      weight: "",
      height: "",
      manualBodyFat: "",
      recordedDate: ""
    });

    refreshRecords();

    setMessage({
      type: "success",
      text: "✅ Health record saved successfully!"
    });
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">🩺 Health Records</h1>
        <p className="text-gray-600">
          Track your progress and understand your body metrics
        </p>
      </div>

      {records.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <HealthChart records={records} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          ➕ Add New Health Record
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm font-medium ${message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
              }`}
          >
            {message.text}
          </div>
        )}

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

          {/* HEIGHT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={canEditHeight ? form.height : lockedHeight}
              onChange={(e) =>
                setForm({ ...form, height: e.target.value })
              }
              disabled={!canEditHeight}
              className={`w-full border p-2 rounded ${canEditHeight
                  ? ""
                  : "bg-gray-100 text-gray-600 cursor-not-allowed"
                }`}
              placeholder="Enter height"
            />
            <p className="text-xs text-gray-500 mt-1">
              {canEditHeight
                ? "Set once as baseline"
                : "Baseline value (locked)"}
            </p>
          </div>

          {/* WEIGHT */}
          <div>
            <label className="block text-sm font-medium mb-1">
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

          {form.weight && effectiveHeight && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard
                label="BMI"
                value={calculatedBMI}
                color="blue"
              />
              <MetricCard
                label="Body Fat %"
                value={finalBodyFat ? `${finalBodyFat}%` : "--"}
                color="purple"
              />
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
