'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, MessageSquare, Mic, Volume2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);
  const [qaAnswer, setQaAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const handleSummarize = async () => {
    setLoading(true);
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  const handleAskQuestion = async () => {
    setLoading(true);
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, question }),
    });
    const data = await res.json();
    setQaAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Notes Assistant</h1>
          <button onClick={() => signOut()} className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block text-lg font-semibold mb-2 items-center">
            <FileText className="w-5 h-5 mr-2" /> Paste Your Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your lecture notes here..."
            className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-4 mt-4">
            <button onClick={handleSummarize} disabled={loading} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              <FileText className="w-4 h-4 mr-2" /> Summarize
            </button>
            <button onClick={handleGenerateQuestions} disabled={loading} className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              <MessageSquare className="w-4 h-4 mr-2" /> Generate Questions
            </button>
          </div>
        </div>

        {summary && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        {questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">Practice Questions</h2>
            <ul className="list-disc list-inside">
              {questions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-lg font-semibold mb-2 items-center">
            <Mic className="w-5 h-5 mr-2" /> Ask a Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask based on your notes..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button onClick={handleAskQuestion} disabled={loading} className="flex items-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50">
            <Volume2 className="w-4 h-4 mr-2" /> Ask & Speak Answer
          </button>
          {qaAnswer && <p className="mt-4">{qaAnswer}</p>}
        </div>
      </div>
    </div>
  );
}