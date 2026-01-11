# AI Notes Summarizer & Q/A Assistant

A modern web-based application that uses Artificial Intelligence to help students summarize lecture notes, generate practice questions, and ask questions based strictly on the provided notes. Built with Next.js and powered by Google's Gemini AI.

## 🚀 Features

- **📝 AI Notes Summarization**: Generate concise summaries of lecture notes instantly
- **❓ Question Generator**: Automatically create practice questions from your notes
- **💬 Context-Based Q/A Assistant**: Ask questions and get answers strictly based on your notes
- **🎤 Voice Input**: Use speech-to-text to ask questions hands-free
- **🔊 Voice Output**: Listen to AI-generated answers with text-to-speech
- **🔐 Secure Authentication**: User authentication with NextAuth.js
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: Google Gemini AI API
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js with JWT
- **Voice Features**: Web Speech API, SpeechSynthesis API
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Google AI API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd note-assist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Google AI
   GOOGLE_API_KEY=your_google_ai_api_key

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and use it as your `NEXTAUTH_SECRET`

5. **Get API Keys**
   - **MongoDB**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster
   - **Google AI**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🚀 Running the Application

**Development mode:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
note-assist/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   └── register/
│   │   │   ├── ask/
│   │   │   ├── generate-questions/
│   │   │   └── summarize/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── mongodb.ts
│   ├── models/
│   │   ├── Note.ts
│   │   └── User.ts
│   └── middleware.ts
├── .env.local
├── package.json
└── README.md
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Notes**: Paste or type your lecture notes in the text area
3. **Summarize**: Click "Summarize" to get a concise summary
4. **Generate Questions**: Click "Generate Questions" to create practice questions
5. **Ask Questions**: Type or use voice input to ask questions about your notes
6. **Voice Features**: 
   - Click the microphone icon to use voice input
   - Click the speaker icon to hear answers read aloud

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with NextAuth middleware
- Secure session management
- Environment variable protection

## 🌐 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `POST /api/summarize` - Generate note summaries
- `POST /api/generate-questions` - Generate practice questions
- `POST /api/ask` - Answer questions based on notes

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add all environment variables from `.env.local` to your Vercel project settings, updating the URLs appropriately:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- Next.js team for the amazing framework
- MongoDB for database services
- NextAuth.js for authentication
- Vercel for hosting

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Save notes history to database
- [ ] Export summaries and questions to PDF
- [ ] Multiple AI model options
- [ ] Collaborative note-taking
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Multi-language support

---

Made with ❤️ for students everywhere