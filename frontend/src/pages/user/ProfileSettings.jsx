import React, { useEffect, useState } from "react";

export default function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    contact: "",
    dateOfBirth: ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    show: false
  });

  // ======================
  // LOAD PROFILE
  // ======================
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/profile?userId=${user.UserID}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => {
        if (data) {
          setForm({
            firstName: data.FirstName || "",
            lastName: data.LastName || "",
            gender: data.Gender || "Male",
            contact: data.Contact || "",
           dateOfBirth: data.DateOfBirth?.slice(0, 10) || ""
          });
        }
      })
      .catch(console.error);
  }, [user.UserID]);

  // ======================
  // SAVE PROFILE
  // ======================
  const saveProfile = async () => {
    await fetch("http://localhost:5000/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        ...form
      })
    });

    alert("Profile saved ✅");
    window.dispatchEvent(new Event("profileUpdated"));
  };

  // ======================
  // CHANGE PASSWORD
  // ======================
  const changePassword = async () => {
    await fetch("http://localhost:5000/api/users/password/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        currentPassword: passwords.current,
        newPassword: passwords.new
      })
    });

    alert("Password updated 🔒");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">👤 Profile Settings</h1>

      {/* Profile Fields */}
      {/* First Name */}
      <label className="font-medium text-sm">First Name</label>
      <input
        className="w-full border p-2 rounded"
        placeholder="Enter your first name"
        value={form.firstName}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
      />
      <p className="text-xs text-gray-500 mb-4">
        Your given name (e.g. Jeckson)
      </p>

      {/* Last Name */}
      <label className="font-medium text-sm">Last Name</label>
      <input
        className="w-full border p-2 rounded"
        placeholder="Enter your last name"
        value={form.lastName}
        onChange={e => setForm({ ...form, lastName: e.target.value })}
      />
      <p className="text-xs text-gray-500 mb-4">
        Your family name (e.g. Liew)
      </p>

      {/* Gender */}
      <label className="font-medium text-sm">Gender</label>
      <select
        className="w-full border p-2 rounded"
        value={form.gender}
        onChange={e => setForm({ ...form, gender: e.target.value })}
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <p className="text-xs text-gray-500 mb-4">
        Used for personalized fitness and nutrition planning
      </p>

      {/* Contact */}
      <label className="font-medium text-sm">Contact Number</label>
      <input
        className="w-full border p-2 rounded"
        placeholder="e.g. 0123456789"
        value={form.contact}
        onChange={e => setForm({ ...form, contact: e.target.value })}
      />
      <p className="text-xs text-gray-500 mb-4">
        Used for account recovery or important notifications
      </p>

      {/* Date of Birth */}
      <label className="font-medium text-sm">Date of Birth</label>
      <input
        className="w-full border p-2 rounded"
        type="date"
        value={form.dateOfBirth}
        onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
      />
      <p className="text-xs text-gray-500 mb-6">
        Helps calculate age-based health and training recommendations
      </p>

      <button
        onClick={saveProfile}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Save Profile
      </button>

      {/* Password Section */}
      <h2 className="text-lg font-semibold mt-6">🔒 Change Password</h2>

      <p className="text-xs text-gray-500 mb-2">
        Use a strong password with at least 8 characters
      </p>

      <input
        className="w-full border p-2"
        type={passwords.show ? "text" : "password"}
        placeholder="Current Password"
        onChange={e =>
          setPasswords({ ...passwords, current: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        type={passwords.show ? "text" : "password"}
        placeholder="New Password"
        onChange={e =>
          setPasswords({ ...passwords, new: e.target.value })
        }
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          onChange={() =>
            setPasswords({ ...passwords, show: !passwords.show })
          }
        />
        Show Password
      </label>

      <button
        onClick={changePassword}
        className="w-full bg-indigo-600 text-white py-2 rounded"
      >
        Change Password
      </button>
    </div>
  );
}
