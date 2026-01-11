import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const prompt = `Summarize the following lecture notes concisely: ${notes}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}