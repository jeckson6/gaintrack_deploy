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
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       pathname === path
         ? "bg-indigo-600 text-white shadow"
         : "text-gray-300 hover:bg-white/10"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-5 text-xl font-extrabold tracking-wide border-b border-white/10">
        💪 GainTrack
        <p className="text-xs font-normal text-gray-400">
          Personal Fitness
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
        <NavLink to="/dashboard" className={linkClass("/dashboard")}>
          <FiHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/health-records"
          className={linkClass("/health-records")}
        >
          <FiActivity />
          Health Records
        </NavLink>

        {/* TRAINING */}
        <Section title="Training">
          <NavLink
            to="/training-plan"
            className={linkClass("/training-plan")}
          >
            🏋 Training Plan
          </NavLink>
        </Section>

        {/* NUTRITION */}
        <Section title="Nutrition">
          <NavLink
            to="/food-plan"
            className={linkClass("/food-plan")}
          >
            🥗 Food Plan
          </NavLink>
        </Section>

        {/* AI */}
        <Section title="AI">
          <NavLink
            to="/ai-assistant"
            className={linkClass("/ai-assistant")}
          >
            🤖 AI Assistant
          </NavLink>
        </Section>

        {/* PROFILE */}
        <Section title="Account">
          <NavLink
            to="/profile-settings"
            className={linkClass("/profile-settings")}
          >
            👤 Profile
          </NavLink>
        </Section>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg
                     text-gray-300 hover:bg-red-600 hover:text-white transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ===== Section Title ===== */
function Section({ title, children }) {
  return (
    <div className="mt-5">
      <p className="px-4 mb-1 text-xs uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
