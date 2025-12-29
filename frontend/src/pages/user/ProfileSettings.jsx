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

  /* ======================
     LOAD PROFILE
  ====================== */
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/profile?userId=${user.UserID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
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

  /* ======================
     SAVE PROFILE
  ====================== */
  const saveProfile = async () => {
    await fetch("http://localhost:5000/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        ...form
      })
    });

    alert("Profile updated successfully ✅");
    window.dispatchEvent(new Event("profileUpdated"));
  };

  /* ======================
     CHANGE PASSWORD
  ====================== */
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
    setPasswords({ current: "", new: "", show: false });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ======================
          PAGE HEADER
      ====================== */}
      <div>
        <h1 className="text-2xl font-bold">👤 Profile Settings</h1>
        <p className="text-gray-600">
          Manage your personal information and account security
        </p>
      </div>

      {/* ======================
          PROFILE INFO
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          🧾 Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" desc="Your given name">
            <input
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
            />
          </Field>

          <Field label="Last Name" desc="Your family name">
            <input
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />
          </Field>

          <Field
            label="Gender"
            desc="Used for fitness & nutrition calculations"
          >
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>

          <Field
            label="Contact Number"
            desc="For account recovery & notifications"
          >
            <input
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />
          </Field>

          <Field
            label="Date of Birth"
            desc="Used for age-based health insights"
          >
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </Field>
        </div>

        <button
          onClick={saveProfile}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Save Profile
        </button>
      </div>

      {/* ======================
          SECURITY
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          🔒 Account Security
        </h2>

        <p className="text-sm text-gray-500">
          Use a strong password with at least 8 characters
        </p>

        <input
          type={passwords.show ? "text" : "password"}
          placeholder="Current Password"
          className="w-full border p-2 rounded"
          value={passwords.current}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
        />

        <input
          type={passwords.show ? "text" : "password"}
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={passwords.new}
          onChange={(e) =>
            setPasswords({ ...passwords, new: e.target.value })
          }
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={passwords.show}
            onChange={() =>
              setPasswords({
                ...passwords,
                show: !passwords.show
              })
            }
          />
          Show password
        </label>

        <button
          onClick={changePassword}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

/* ======================
   FIELD COMPONENT
====================== */
function Field({ label, desc, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <p className="text-xs text-gray-500 mb-1">{desc}</p>
      {React.cloneElement(children, {
        className: "w-full border p-2 rounded"
      })}
    </div>
  );
}
