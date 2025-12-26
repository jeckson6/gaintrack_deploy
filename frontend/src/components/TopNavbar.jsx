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

  // Initial load
  useEffect(() => {
    fetchProfile();

    // Listen for profile updates
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
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-black text-xl"
      >
        <FiMenu />
      </button>

      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">{user.Email}</span>

        <img
          src={avatar}
          alt="Profile"
          title="Profile Settings"
          onClick={() => navigate("/profile-settings")}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
}
