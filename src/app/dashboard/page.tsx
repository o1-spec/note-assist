'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FileText, MessageSquare, Mic, Volume2, LogOut, Sparkles, BookOpen, Loader2, X, Save, History, Download, FileDown, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportNoteToPDF, exportSummaryToPDF, exportQuestionsToPDF, exportToText, exportToMarkdown } from '@/lib/exportUtils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);
  const [qaAnswer, setQaAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setNotes(data.text);
        setNoteTitle(file.name.replace('.pdf', ''));
        toast.success('PDF uploaded and text extracted successfully!');
      } else {
        toast.error(data.error || 'Failed to process PDF');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('An error occurred while uploading PDF');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast.error('Please enter a title for your note');
      return;
    }
    if (!notes.trim()) {
      toast.error('Please enter some notes to save');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/notes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          originalNotes: notes,
          summary,
          questions,
          category,
        }),
      });

      if (res.ok) {
        toast.success('Note saved successfully!');
        setShowSaveDialog(false);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('An error occurred while saving');
    }
    setSaving(false);
  };

  const handleExport = (format: string) => {
    const title = noteTitle || 'Untitled Note';
    
    try {
      switch (format) {
        case 'pdf-full':
          exportNoteToPDF(title, notes, summary, questions, category);
          toast.success('Exported as PDF successfully!');
          break;
        case 'pdf-summary':
          if (!summary) {
            toast.error('No summary to export. Generate a summary first.');
            return;
          }
          exportSummaryToPDF(title, summary, category);
          toast.success('Summary exported as PDF!');
          break;
        case 'pdf-questions':
          if (questions.length === 0) {
            toast.error('No questions to export. Generate questions first.');
            return;
          }
          exportQuestionsToPDF(title, questions, category);
          toast.success('Questions exported as PDF!');
          break;
        case 'text':
          exportToText(title, notes, summary, questions);
          toast.success('Exported as Text file!');
          break;
        case 'markdown':
          exportToMarkdown(title, notes, summary, questions, category);
          toast.success('Exported as Markdown file!');
          break;
        default:
          break;
      }
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export. Please try again.');
    }
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

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* All existing dialogs (Export, Save, Logout) remain the same */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Export Note</h3>
              <button 
                onClick={() => setShowExportDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExport('pdf-full')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileDown className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Full Note (PDF)</p>
                    <p className="text-xs text-gray-500">Notes, summary & questions</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>

              {summary && (
                <button
                  onClick={() => handleExport('pdf-summary')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <FileDown className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Summary Only (PDF)</p>
                      <p className="text-xs text-gray-500">Just the AI summary</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              )}

              {questions.length > 0 && (
                <button
                  onClick={() => handleExport('pdf-questions')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <FileDown className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Questions Only (PDF)</p>
                      <p className="text-xs text-gray-500">Practice questions</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              )}

              <button
                onClick={() => handleExport('text')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Text File (.txt)</p>
                    <p className="text-xs text-gray-500">Plain text format</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>

              <button
                onClick={() => handleExport('markdown')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Markdown (.md)</p>
                    <p className="text-xs text-gray-500">Formatted text</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Save Note</h3>
              <button 
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Note Title *
                </label>
                <input
                  type="text"
                  id="noteTitle"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g., Math Lecture - Chapter 5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  This will save your notes{summary && ', summary'}
                  {questions.length > 0 && ', and questions'} to your history.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={saving || !noteTitle.trim()}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Logout</h3>
              <button 
                onClick={() => setShowLogoutDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? Any unsaved work will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome, {session?.user?.name || 'User'}</h1>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/dashboard/history')}
                className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button 
                onClick={() => setShowLogoutDialog(true)} 
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notes Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
            </div>
            
            {/* PDF Upload Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your lecture notes here, or upload a PDF..."
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
            <button 
              onClick={() => setShowSaveDialog(true)} 
              disabled={!notes.trim()} 
              className="flex items-center space-x-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
            <button 
              onClick={() => setShowExportDialog(true)} 
              disabled={!notes.trim()} 
              className="flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
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