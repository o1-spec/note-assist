'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/auth/login'); 
    } else {
      const data = await res.json();
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}