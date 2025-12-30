import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(email, password);

      setSuccess("🎉 Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-indigo-600">
              GainTrack
            </h1>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Start your fitness journey today
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 8 characters)"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={!!success}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-60"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
