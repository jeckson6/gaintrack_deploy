import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ===== Layouts ===== */
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ===== Route Guards ===== */
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

/* ===== Public Pages ===== */
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ===== User Pages ===== */
import Dashboard from "./pages/user/Dashboard";
import HealthRecords from "./pages/user/HealthRecords";
import TrainingPlan from "./pages/user/TrainingPlan";
import FoodPlan from "./pages/user/FoodPlan";
import AIAssistant from "./pages/user/AIAssistant";
import ProfileSettings from "./pages/user/ProfileSettings";

/* ===== Admin Pages ===== */
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AIUsageMonitor from "./pages/admin/AIUsageMonitor";
import SystemAnalytics from "./pages/admin/SystemAnalytics";

function App() {
  return (
    <Routes>

      {/* ===================== */}
      {/* PUBLIC ROUTES */}
      {/* ===================== */}
     <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===================== */}
      {/* USER ROUTES */}
      {/* ===================== */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/training-plan" element={<TrainingPlan />} />
        <Route path="/food-plan" element={<FoodPlan />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
      </Route>

      {/* ===================== */}
      {/* ADMIN ROUTES */}
      {/* ===================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
         <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<SystemAnalytics />} />
        <Route path="ai-usage" element={<AIUsageMonitor />} />
      </Route>

    </Routes>
  );
}

export default App;
