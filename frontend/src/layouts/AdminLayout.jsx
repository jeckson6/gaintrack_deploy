// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminTopNavbar from "../components/admin/AdminTopNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminTopNavbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
