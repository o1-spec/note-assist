'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, MessageSquare, Mic, Volume2, LogOut, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);
  const [qaAnswer, setQaAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleSummarize = async () => {
    if (!notes.trim()) {
      toast.error('Please enter some notes first');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSummary(data.summary);
        toast.success('Summary generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      toast.error('An error occurred while summarizing');
    }
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!notes.trim()) {
      toast.error('Please enter some notes first');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setQuestions(data.questions);
        toast.success('Questions generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('An error occurred while generating questions');
    }
    setLoading(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    if (!notes.trim()) {
      toast.error('Please enter notes first to ask questions about');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, question }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setQaAnswer(data.answer);
        toast.success('Answer generated!');
      } else {
        toast.error(data.error || 'Failed to get answer');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('An error occurred while getting the answer');
    }
    setLoading(false);
  };

  const startListening = () => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Listening... Speak now');
      };
      recognition.onresult = (event: any) => {
        setQuestion(event.results[0][0].transcript);
        toast.success('Voice input captured!');
      };
      recognition.onerror = () => {
        toast.error('Voice recognition failed');
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      toast.error('Voice recognition not supported in your browser');
    }
  };

  const speakAnswer = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      toast.success('Reading answer aloud...');
    } else {
      toast.error('Text-to-speech not supported in your browser');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Notes Assistant</h1>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notes Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your lecture notes here..."
            className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={handleSummarize} 
              disabled={loading || !notes.trim()} 
              className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Summarize</span>
            </button>
            <button 
              onClick={handleGenerateQuestions} 
              disabled={loading || !notes.trim()} 
              className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              <span>Generate Questions</span>
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Summary Section */}
          {summary && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            </div>
          )}

          {/* Questions Section */}
          {questions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Practice Questions</h2>
              </div>
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Mic className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ask a Question</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question based on your notes..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button 
              onClick={startListening} 
              disabled={isListening}
              className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              title="Voice input"
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <button 
            onClick={handleAskQuestion} 
            disabled={loading || !question.trim() || !notes.trim()} 
            className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            <span>Get Answer</span>
          </button>

          {qaAnswer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Answer:</h3>
                <button 
                  onClick={() => speakAnswer(qaAnswer)} 
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{qaAnswer}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}