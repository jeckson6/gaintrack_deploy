import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  /* ======================
     STATE MANAGEMENT
  ====================== */

  // Stores user input for email
  const [email, setEmail] = useState("");

  // Stores user input for password
  const [password, setPassword] = useState("");

  // Stores error message for failed login attempts
  const [error, setError] = useState("");

  // Stores success message after successful login
  const [success, setSuccess] = useState("");

  // React Router navigation hook
  const navigate = useNavigate();

  /* ======================
     LOGIN HANDLER
  ====================== */

  // Handles form submission and login logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset messages before new attempt
    setError("");
    setSuccess("");

    try {
      // Send login request to backend API
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // Parse response data
      const data = await res.json();

      // Handle authentication failure
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store authenticated user data in local storage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Display success message
      setSuccess("Login successful. Redirecting...");

      // Role-based navigation after login
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin"); // Redirect admin users
        } else {
          navigate("/dashboard"); // Redirect normal users
        }
      }, 1200);
    } catch {
      // Handle server or network error
      setError("Server error. Please try again.");
    }
  };

  /* ======================
     USER INTERFACE
  ====================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Application Logo and Tagline */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-indigo-600 hover:opacity-80 transition">
              GainTrack
            </h1>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Track smarter. Train better.
          </p>
        </div>

        {/* Page Title */}
        <h2 className="text-xl font-semibold text-center mb-4">
          Sign in to your account
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success Message Display */}
        {success && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mb-4">
            {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email Input Field */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input Field */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot Password Navigation */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        {/* Register Navigation */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
