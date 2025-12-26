import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import HealthRecords from './pages/HealthRecords';
import TrainingPlan from './pages/TrainingPlan';
import FoodPlan from './pages/FoodPlan';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
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
    </Routes>
  );
}

export default App;
