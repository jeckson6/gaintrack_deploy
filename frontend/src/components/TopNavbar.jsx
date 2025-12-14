import React from "react";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";
import { FiMenu } from "react-icons/fi";

export default function TopNavbar({ toggleSidebar }) {
  // TEMP: simplified user data
  const user = {
    gender: "Male", // or "Female"
    email: "user@gaintrack.com",
  };

  const avatar =
    user.gender === "Female" ? femaleAvatar : maleAvatar;

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Left */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-black text-xl"
      >
        <FiMenu />
      </button>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">{user.email}</span>
        <img
          src={avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>
    </div>
  );
}
