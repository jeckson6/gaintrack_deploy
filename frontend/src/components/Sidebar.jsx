import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiActivity,
  FiLogOut
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  const subLinkClass = (path) =>
    `flex items-center gap-3 pl-10 pr-4 py-2 rounded text-sm ${
      pathname === path
        ? "bg-indigo-500 text-white"
        : "text-gray-400 hover:bg-gray-700"
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        GainTrack
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        <NavLink to="/dashboard" className={linkClass("/dashboard")}>
          <FiHome />
          Dashboard
        </NavLink>

        <NavLink to="/health-records" className={linkClass("/health-records")}>
          <FiActivity />
          Health Records
        </NavLink>

        {/* ===== TRAINING SECTION ===== */}
        <div className="mt-4">
          <p className="px-4 text-xs uppercase text-gray-400 mb-1">
            Training
          </p>

          <NavLink
            to="/training-plan"
            className={linkClass("/training-plan")}
          >
            🏋 Training Plan
          </NavLink>
        </div>

        {/* ===== FOOD SECTION ===== */}
        <div className="mt-4">
          <p className="px-4 text-xs uppercase text-gray-400 mb-1">
            Nutrition
          </p>

          <NavLink
            to="/food-plan"
            className={linkClass("/food-plan")}
          >
            🥗 Food Plan
          </NavLink>
        </div>

        {/* ===== AI ===== */}
        <div className="mt-4">
          <NavLink
            to="/ai-assistant"
            className={linkClass("/ai-assistant")}
          >
            🤖 AI Assistant
          </NavLink>
        </div>


         {/* ===== Profile Settings ===== */}
        <div className="mt-4">
          <NavLink
            to="/profile-settings"
            className={linkClass("/profile-settings")}
          >
            👤 Profile 
          </NavLink>
        </div>

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
