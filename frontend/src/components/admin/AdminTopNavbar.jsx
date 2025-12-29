import React, { useEffect, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";

export default function AdminTopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const adminUser = JSON.parse(localStorage.getItem("user"));
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  if (!adminUser) return null;

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-400"
      : "hover:text-indigo-400";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openProfile = async () => {
    const res = await fetch(
      `http://localhost:5000/api/admins/profile?userId=${adminUser.UserID}`
    );
    const data = await res.json();
    setProfile(data);
    setShowProfile(true);
  };

  return (
    <>
      <div className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
        {/* Left */}
        <div>
          <h1 className="text-lg font-bold leading-none">GainTrack</h1>
          <p className="text-xs text-gray-400 underline">Admin Panel</p>
        </div>

        {/* Center */}
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => navigate("/admin")}
            className={isActive("/admin/dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className={isActive("/admin/users")}
          >
            Users
          </button>

          <button
            onClick={() => navigate("/admin/ai-usage")}
            className={isActive("/admin/ai-usage")}
          >
            AI Usage
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className={isActive("/admin/analytics")}
          >
            Analytics
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={openProfile}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <FiUser />
            {adminUser.Email}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {showProfile && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
