// FILE: UserManagement.jsx
import React, { useEffect, useState } from "react";
import ProfileModal from "../../components/admin/ProfileModal";
import Toast from "../../components/common/Toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);


  const adminUserId = JSON.parse(localStorage.getItem("user"))?.UserID;

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/admins/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    await fetch("http://localhost:5000/api/admins/users/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        isActive: !user.IsActive,
        adminUserId
      })
    });

    setToast({
      message: user.IsActive ? "User deactivated" : "User activated",
      type: user.IsActive ? "warning" : "success"
    });

    loadUsers();
  };

  const createAdmin = async (email, password) => {
    const currentAdmin = JSON.parse(localStorage.getItem("user"));

    await fetch("http://localhost:5000/api/admins/admins/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName: "System",
        lastName: "Admin",
        gender: "Other",
        contact: null,
        adminUserId: currentAdmin.UserID
      })
    });

    loadUsers();
  };



  const openProfile = async (userId) => {
    const res = await fetch(
      `http://localhost:5000/api/admins/users/profile?userId=${userId}`
    );
    const data = await res.json();
    setSelected({ mode: "edit", ...data });
  };

  const saveProfile = async (userId, form) => {
    if (!userId) {
      await fetch("http://localhost:5000/api/admins/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUserId,
          email: form.email,
          password: form.password,
          makeAdmin: form.makeAdmin
        })
      });

      setToast({ message: "User created", type: "success" });
    } else {
      await fetch("http://localhost:5000/api/admins/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUserId,
          userId,
          ...form
        })
      });

      setToast({ message: "Profile updated", type: "success" });
    }

    setSelected(null);
    loadUsers();
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(
      `http://localhost:5000/api/admins/users/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUserId })
      }
    );

    setToast({ message: "User deleted", type: "warning" });
    loadUsers();
  };

 const filteredUsers = users.filter((u) => {
  const keyword = search.toLowerCase();

  return (
    String(u.UserID).includes(keyword) ||        // ✅ User ID
    u.Email.toLowerCase().includes(keyword) ||   // ✅ Email
    u.Role.toLowerCase().includes(keyword) ||    // ✅ Role
    (u.IsActive ? "active" : "inactive").includes(keyword) // ✅ Status
  );
});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>


        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search ID, email, role, status..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />

          <button
            onClick={() => setSelected({ mode: "create" })}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add User
          </button>

          <button
            onClick={() => setShowAddAdmin(true)}
            className="bg-slate-500 text-white px-4 py-2 rounded text-sm"
          >
            + Add Admin
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">No.</th>
              <th>ID</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {filteredUsers.map((u, index) => (
              <tr key={u.UserID} className="border-t text-sm">
                <td className="p-3">{index + 1}</td>

                <td>{u.UserID}</td>

                <td>
                  {u.Email}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${u.IsActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {u.IsActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{u.Role}</td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => openProfile(u.UserID)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(u)}
                    className={`px-3 py-1 rounded text-white text-xs ${u.IsActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    {u.IsActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => deleteUser(u.UserID)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ProfileModal
          profile={selected}
          onClose={() => setSelected(null)}
          onSave={(form) =>
            saveProfile(selected.UserID, form)
          }
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showAddAdmin && (
        <AddAdminModal
          onClose={() => setShowAddAdmin(false)}
          onCreate={createAdmin}
        />
      )}
    </div>
  );

  function AddAdminModal({ onClose, onCreate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <form
          className="bg-white p-6 rounded w-96"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(email, password);
          }}
        >
          <h2 className="text-lg font-bold mb-4">Add Admin</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    );
  }


}
