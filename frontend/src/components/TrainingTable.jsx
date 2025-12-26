import React, { useState } from "react";

export default function TrainingTable({ trainingPlan }) {
  return (
    <div className="space-y-6">
      {trainingPlan.map((day, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-lg">
            {day.day} — {day.focus}
          </h3>

          <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
            {day.exercises.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
