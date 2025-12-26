const API_URL = 'http://localhost:5000/api';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Register failed');
  return res.json();
}

export async function getProfile(userId) {
  const res = await fetch(
    `http://localhost:5000/api/users/profile?userId=${userId}`
  );

  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function updateProfile(profileData) {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData)
  });

  if (!res.ok) throw new Error("Profile update failed");
  return res.json();
}
