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

    const prompt = `Generate 5 practice questions based on the following lecture notes: ${notes}`;
    const result = await model.generateContent(prompt);
    const questionsText = result.response.text();
    const questions = questionsText.split('\n').filter(q => q.trim());

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}