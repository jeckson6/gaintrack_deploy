import React, { useEffect, useState } from "react";
import HealthChart from "../components/HealthChart";

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    weight: "",
    bodyFat: "",
    bmi: ""
  });

  const [form, setForm] = useState({
    weight: "",
    bodyFat: "",
    bmi: "",
    activityLevel: "Moderate",
    goalType: "Maintain",
    recordedDate: ""
  });

  const handleAddRecord = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: 1, // simplified system
        weight: form.weight,
        bodyFat: form.bodyFat,
        bmi: form.bmi,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
        recordedDate: form.recordedDate
      })
    });
    refreshRecords();
    resetForm();

  };

  // ✅ EDIT
  const startEdit = (record) => {
    setEditingId(record.RecordID);
    setEditForm({
      weight: record.Weight_kg,
      bodyFat: record.BodyFatPercentage,
      bmi: record.BMI
    });
  };

  // ✅ UPDATE
  const handleUpdate = async (recordId) => {
    await fetch(`http://localhost:5000/api/health/${recordId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });

    setEditingId(null);
    refreshRecords();
  };

  // ✅ DELETE
  const handleDelete = async (recordId) => {
    if (!window.confirm("Delete this record?")) return;

    await fetch(`http://localhost:5000/api/health/${recordId}`, {
      method: "DELETE"
    });

    refreshRecords();
  };

  // ✅ FETCH
  const refreshRecords = async () => {
    const res = await fetch("http://localhost:5000/api/health?userId=1");
    setRecords(await res.json());
  };

  const resetForm = () => {
    setForm({
      weight: "",
      bodyFat: "",
      bmi: "",
      activityLevel: "Moderate",
      goalType: "Maintain",
      recordedDate: ""
    });
  };

  useEffect(() => {
    refreshRecords();
  }, []);

  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
    <p className="text-gray-500">
      Track your health progress and manage records
    </p>
  </div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Health Records</h1>

      <div className="mb-6">
        {records.length > 0 && <HealthChart records={records} />}
      </div>


      <h2 className="text-xl font-semibold mb-4">Health Records History</h2>

      <table className="w-full text-sm">
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
              <td> {new Date(r.RecordedDate).toISOString().split("T")[0]}</td>

              <td>
                {editingId === r.RecordID ? (
                  <input
                    className="border w-20 text-center"
                    value={editForm.weight}
                    onChange={(e) =>
                      setEditForm({ ...editForm, weight: e.target.value })
                    }
                  />
                ) : (
                  r.Weight_kg
                )}
              </td>

              <td>
                {editingId === r.RecordID ? (
                  <input
                    className="border w-20 text-center"
                    value={editForm.bmi}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bmi: e.target.value })
                    }
                  />
                ) : (
                  r.BMI
                )}
              </td>

              <td>
                {editingId === r.RecordID ? (
                  <input
                    className="border w-20 text-center"
                    value={editForm.bodyFat}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bodyFat: e.target.value })
                    }
                  />
                ) : (
                  r.BodyFatPercentage
                )}
              </td>

              <td className="space-x-2">
                {editingId === r.RecordID ? (
                  <>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      onClick={() => handleUpdate(r.RecordID)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      onClick={() => startEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(r.RecordID)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Health Record</h2>

        <form
          onSubmit={handleAddRecord}
          className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-4"
        >

          <input
            type="date"
            className="border p-2"
            value={form.recordedDate}
            onChange={(e) => setForm({ ...form, recordedDate: e.target.value })}
            required
          />

          <input
            type="number"
            step="0.1"
            placeholder="Weight (kg)"
            className="border p-2"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
          />

          <input
            type="number"
            step="0.1"
            placeholder="BMI"
            className="border p-2"
            value={form.bmi}
            onChange={(e) => setForm({ ...form, bmi: e.target.value })}
            required
          />

          <input
            type="number"
            step="0.1"
            placeholder="Body Fat %"
            className="border p-2"
            value={form.bodyFat}
            onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
          />

          <select
            className="border p-2"
            value={form.activityLevel}
            onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
          >
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>

          <select
            className="border p-2"
            value={form.goalType}
            onChange={(e) => setForm({ ...form, goalType: e.target.value })}
          >
            <option>Maintain</option>
            <option>Bulking</option>
            <option>Cutting</option>
          </select>

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Health Record
          </button>
        </form>
      </div>
    </div>
  );
}
