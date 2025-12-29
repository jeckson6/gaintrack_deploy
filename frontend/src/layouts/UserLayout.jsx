import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* ===== SIDEBAR (Desktop) ===== */}
      {showSidebar && (
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>
      )}

      {/* ===== SIDEBAR (Mobile Overlay) ===== */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSidebar(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col h-full">
        <TopNavbar toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
