import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, MessageSquare, Mic } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text px-4">
            AI Notes Assistant
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Transform your study sessions with AI-powered summarization, practice questions, and intelligent Q&A
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Smart Summaries</h3>
            <p className="text-xs sm:text-sm text-gray-600">Get concise summaries of your lecture notes in seconds</p>
          </div>
          
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Practice Questions</h3>
            <p className="text-xs sm:text-sm text-gray-600">Generate targeted questions to test your knowledge</p>
          </div>
          
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Voice Q&A</h3>
            <p className="text-xs sm:text-sm text-gray-600">Ask questions using your voice and hear answers aloud</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center mx-2 sm:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to ace your studies?</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">Join now and experience the future of learning</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;