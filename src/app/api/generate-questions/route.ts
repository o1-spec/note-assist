import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notes } = await req.json();
    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Generate 5 practice questions based on these lecture notes. Make them thought-provoking and cover key concepts. Format each question on a new line:\n\n${notes}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: 'Gemini error', details: data },
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    
    const questions = text
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((q: string) => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').replace(/^\*\s*/, '').trim())
      .filter((q: string) => q.length > 10);

    return NextResponse.json({ questions: questions.slice(0, 5) }, { status: 200 });
  } catch (err: any) {
    console.error('Error in generate-questions API:', err);
    return NextResponse.json(
      { error: 'Failed to generate questions', details: err.message },
      { status: 500 }
    );
  }
}