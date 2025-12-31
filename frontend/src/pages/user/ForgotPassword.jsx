import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/users/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, confirmEmail })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Password reset failed");
      return;
    }

    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* LOGO */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-indigo-600 hover:opacity-80 transition">
              GainTrack
            </h1>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Recover access to your account
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mb-4 border border-green-300">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Confirm email address"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            Send Temporary Password
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
