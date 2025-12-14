import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiActivity,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // if you use token later
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        GainTrack
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          <FiHome />
          Dashboard
        </NavLink>

        <NavLink to="/health-records" className={linkClass}>
          <FiActivity />
          Health Records
        </NavLink>

        <NavLink to="/training-plan" className={linkClass}>
          <FiCalendar />
          Training Plan
        </NavLink>

        <NavLink to="/food-plan" className={linkClass}>
          <FiCalendar />
          Food Plan
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}
