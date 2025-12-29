import React, { useEffect, useState } from "react";
import HealthChart from "../../components/user/HealthChart";

export default function HealthRecords() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const [profile, setProfile] = useState(null);


  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    weight: "",
    bodyFat: "",
    bmi: ""
  });

  const [form, setForm] = useState({
    weight: "",
    height: "",
    manualBodyFat: "",
    activityLevel: "",
    goalType: "",
    recordedDate: ""
  });

  // ---------- helpers ----------
  const gender = profile?.Gender;
  const dateOfBirth = profile?.DateOfBirth;

  const firstRecordHeight =
    records.length > 0 ? records[0].Height_cm : null;

  const hasHeight = !!firstRecordHeight;

  // height used for BMI calculation
  const effectiveHeight = hasHeight ? firstRecordHeight : form.height;


  // age
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

  // BMI
  const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return "";
    const h = heightCm / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const calculatedBMI = calculateBMI(form.weight, effectiveHeight);

  // Body fat
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




  // ---------- fetch ----------
  const refreshRecords = async () => {
    const res = await fetch(
      `http://localhost:5000/api/health?userId=${user.UserID}`
    );
    setRecords(await res.json());
  };

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/profile?userId=${user.UserID}`
        );

        if (!res.ok) return; // 🔒 stop loop on error

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch failed");
      }

      refreshRecords();
    };

    loadData();
  }, []); // ❗ EMPTY DEP ARRAY




  // ---------- add ----------
  const handleAddRecord = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        weight: form.weight,
        height: form.height, // only sent if first time
        bmi: calculatedBMI,
        bodyFat: finalBodyFat,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
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
      activityLevel: "Moderate",
      goalType: "Maintain",
      recordedDate: ""
    });

    refreshRecords();
  };



  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Health Records</h1>

      {records.length > 0 && <HealthChart records={records} />}

      {/* TABLE */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
            <th>Date</th>
            <th>Weight</th>
            <th>BMI</th>
            <th>Body Fat %</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.RecordID} className="text-center border-t">
              <td>{r.RecordedDate.split("T")[0]}</td>
              <td>{r.Weight_kg}</td>
              <td>{r.BMI}</td>
              <td>{r.BodyFatPercentage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Add Health Record</h2>

        <form
          onSubmit={handleAddRecord}
          className="grid grid-cols-2 gap-4"
        >
          <input
            type="date"
            className="border p-2 col-span-2"
            value={form.recordedDate}
            onChange={e =>
              setForm({ ...form, recordedDate: e.target.value })
            }
            required
          />

          {/* HEIGHT */}
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">
              Height (cm)
            </label>

            <input
              type="number"
              placeholder="Height(cm)"
              className={`border p-2 w-full rounded ${hasHeight ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                }`}
              value={hasHeight ? firstRecordHeight : form.height}
              onChange={(e) =>
                !hasHeight &&
                setForm({ ...form, height: e.target.value })
              }
              disabled={hasHeight}
              required={!hasHeight}
            />

            {hasHeight && (
              <p className="text-xs text-gray-500 mt-1">
                Height is a baseline value and cannot be edited once saved.
              </p>
            )}
          </div>




          <input
            type="number"
            step="0.1"
            placeholder="Weight (kg)"
            className="border p-2"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
            required
          />

          <select
            className="border p-2"
            value={form.activityLevel}
            onChange={e =>
              setForm({ ...form, activityLevel: e.target.value })
            }
          >
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>

          <select
            className="border p-2"
            value={form.goalType}
            onChange={e =>
              setForm({ ...form, goalType: e.target.value })
            }
          >
            <option>Maintain</option>
            <option>Bulking</option>
            <option>Cutting</option>
          </select>

          {form.weight && effectiveHeight && (
            <div className="col-span-2 mt-4 grid grid-cols-2 gap-4">

              {/* BMI */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                <p className="text-sm text-gray-600">BMI</p>
                <p className="text-2xl font-bold text-blue-700">
                  {calculatedBMI}
                </p>
              </div>

              {/* Body Fat */}
              <div className="bg-purple-50 border border-purple-200 rounded p-4 text-center">
                <p className="text-sm text-gray-600">
                  Body Fat % {form.manualBodyFat ? "(Manual)" : "(Estimated)"}
                </p>

                <p className="text-2xl font-bold text-purple-700">
                  {finalBodyFat ? `${finalBodyFat}%` : "--"}
                </p>

                {/* Optional manual input */}
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter manually (optional)"
                  className="mt-3 w-full border p-2 text-sm rounded"
                  value={form.manualBodyFat}
                  onChange={(e) =>
                    setForm({ ...form, manualBodyFat: e.target.value })
                  }
                />
              </div>


              <p className="col-span-2 text-xs text-gray-500 text-center">
                BMI and body fat percentage are calculated automatically to help users
                who are unfamiliar with manual calculations.
              </p>
            </div>
          )}


          <button className="col-span-2 bg-green-600 text-white py-2 rounded">
            Add Health Record
          </button>
        </form>
      </div>
    </div>
  );
}
