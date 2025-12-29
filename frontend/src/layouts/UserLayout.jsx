import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <TopNavbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
