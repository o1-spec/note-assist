import React from 'react';
import Link from 'next/link';

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Notes Summarizer & Q/A Assistant</h1>
        <p className="text-gray-600 mb-6">
          Summarize lecture notes, generate practice questions, and get answers based on your notes—all powered by AI.
        </p>
        <div className="space-y-4">
          <Link href="/auth/login" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/auth/register" className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;