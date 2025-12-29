// FILE: ProfileModal.jsx
import React, { useEffect, useState } from "react";

export default function ProfileModal({ profile, onClose, onSave }) {
  const isCreate = profile?.mode === "create";
  const [editMode, setEditMode] = useState(isCreate);

  const [form, setForm] = useState({
    email: "",
    password: "",
    makeAdmin: false,
    firstName: "",
    lastName: "",
    gender: "",
    contact: "",
    dateOfBirth: "",
    isActive: true
  });

  useEffect(() => {
    if (!profile || isCreate) return;

    setForm((prev) => ({
      ...prev,
      firstName: profile.FirstName ?? "",
      lastName: profile.LastName ?? "",
      gender: profile.Gender ?? "",
      contact: profile.Contact ?? "",
      dateOfBirth: profile.DateOfBirth ?? "",
      isActive: Boolean(profile.IsActive)
    }));

    setEditMode(false);
  }, [profile?.UserID]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[460px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {isCreate ? "Add User" : "User Profile"}
          </h2>

          {!isCreate && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            >
              Update
            </button>
          )}
        </div>

        {!isCreate && (
          <div className="text-sm mb-4 space-y-1">
            <p><b>Email:</b> {profile?.Email ?? "-"}</p>
            <p><b>Role:</b> {profile?.Role ?? "-"}</p>
          </div>
        )}

        {isCreate && (
          <div className="space-y-3 text-sm">
            <Field label="Email">
              <input
                value={form.email}
                onChange={onChange("email")}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={onChange("password")}
              />
            </Field>
          </div>
        )}

        {!isCreate && (
          <div className="space-y-3 text-sm">
            <Field label="First Name">
              <input
                value={form.firstName}
                onChange={onChange("firstName")}
                disabled={!editMode}
              />
            </Field>

            <Field label="Last Name">
              <input
                value={form.lastName}
                onChange={onChange("lastName")}
                disabled={!editMode}
              />
            </Field>

            <Field label="Gender">
              <select
                value={form.gender}
                onChange={onChange("gender")}
                disabled={!editMode}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Contact">
              <input
                value={form.contact}
                onChange={onChange("contact")}
                disabled={!editMode}
              />
            </Field>

            <Field label="Date of Birth">
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={onChange("dateOfBirth")}
                disabled={!editMode}
              />
            </Field>




            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={onChange("isActive")}
                disabled={!editMode}
              />
              Active
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Close</button>

          {(isCreate || editMode) && (
            <button
              onClick={() => onSave(form)}
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {React.cloneElement(children, {
        className:
          "w-full border rounded p-2 disabled:bg-gray-100 disabled:text-gray-600"
      })}
    </div>
  );
}
