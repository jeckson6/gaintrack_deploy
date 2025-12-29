import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [announcement, setAnnouncement] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admins/config")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncement(data.announcement || "");
        setExpiresAt(data.expiresAt || null);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome to GainTrack</h1>

      {announcement && (
        <div className="mb-6 bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>
              📢 <b>Announcement:</b> {announcement}
            </span>

            {expiresAt && (
              <span className="text-xs text-gray-600">
                Expires on {new Date(expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      <p className="text-gray-600 mb-6">
        Track your health, optimize training, and improve nutrition.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">🩺 Health Records</h2>
          <p className="text-sm text-gray-500 mb-3">
            Monitor weight, BMI, and body fat
          </p>
          <Link to="/health-records" className="text-blue-600">
            View Records →
          </Link>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">🏋 Training Plan</h2>
          <p className="text-sm text-gray-500 mb-3">
            AI-generated workout schedule
          </p>
          <Link to="/training-plan" className="text-blue-600">
            View Plan →
          </Link>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">🥗 Food Plan</h2>
          <p className="text-sm text-gray-500 mb-3">
            Personalized nutrition guidance
          </p>
          <Link to="/food-plan" className="text-blue-600">
            View Plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
