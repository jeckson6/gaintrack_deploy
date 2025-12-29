import React, { useEffect, useState } from "react";

export default function AIUsageMonitor() {
  const [usage, setUsage] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const adminUserId = JSON.parse(localStorage.getItem("user"))?.UserID;

  useEffect(() => {
    fetch("http://localhost:5000/api/admins/ai-usage")
      .then((res) => res.json())
      .then(setUsage);

    fetch("http://localhost:5000/api/admins/config")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncement(data.announcement || "");
        setExpiresAt(data.expiresAt || "");
      });
  }, []);

  const saveAnnouncement = async () => {
    await fetch("http://localhost:5000/api/admins/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        announcement,
        expiresAt: expiresAt || null,
        adminUserId
      })
    });

    alert("Announcement saved");
  };

  if (!usage) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 AI Usage</h1>

      <div className="bg-white p-4 shadow rounded">
        <p>Unsplash Requests</p>
        <progress
          value={usage.unsplash.used}
          max={usage.unsplash.limit}
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          {usage.unsplash.used} / {usage.unsplash.limit}
        </p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <p>OpenAI Requests Today</p>
        <p className="text-xl font-bold">{usage.openai.today}</p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">📢 Announcement</h3>

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="w-full border p-2 mb-2"
          placeholder="Enter announcement message..."
        />

        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="border rounded p-2 text-sm"
        />

        <button
          onClick={saveAnnouncement}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
