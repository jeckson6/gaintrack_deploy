import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">GainTrack</h2>

      <ul className="space-y-4">
        <li className="hover:text-green-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-green-400 cursor-pointer">Training Plan</li>
        <li className="hover:text-green-400 cursor-pointer">Food Plan</li>
        <li className="hover:text-green-400 cursor-pointer">Profile</li>
      </ul>
    </div>
  );
}
