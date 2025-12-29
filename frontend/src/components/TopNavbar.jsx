import React, { useEffect, useState } from "react";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";
import otherAvatar from "../assets/other.png";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TopNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState(null);

  // ======================
  // FETCH PROFILE
  // ======================
  const fetchProfile = async () => {
    if (!user) return;

    const res = await fetch(
      `http://localhost:5000/api/users/profile?userId=${user.UserID}`
    );
    const data = await res.json();
    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();

    const onProfileUpdated = () => fetchProfile();
    window.addEventListener("profileUpdated", onProfileUpdated);

    return () =>
      window.removeEventListener("profileUpdated", onProfileUpdated);
  }, []);

  if (!user) return null;

  // ======================
  // AVATAR LOGIC
  // ======================
  const avatar =
    profile?.ProfileImageURL ||
    (profile?.Gender === "Male"
      ? maleAvatar
      : profile?.Gender === "Female"
      ? femaleAvatar
      : otherAvatar);

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-indigo-600 text-xl"
        >
          <FiMenu />
        </button>

        <span className="hidden md:inline text-sm text-gray-500">
          Welcome back 👋
        </span>
      </div>

      {/* RIGHT */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/profile-settings")}
      >
        <span className="text-sm text-gray-600">
          {user.Email}
        </span>

        <img
          src={avatar}
          alt="Profile"
          title="Profile Settings"
          className="w-9 h-9 rounded-full border border-gray-300 hover:ring-2 hover:ring-indigo-500 transition"
        />
      </div>
    </header>
  );
}
