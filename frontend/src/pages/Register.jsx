import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { register } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(email, password);
      window.location.href = '/complete-profile';
    } catch {
      alert('Register failed');
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </AuthLayout>
  );
}
