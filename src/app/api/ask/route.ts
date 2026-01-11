import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notes, question } = await req.json();
    if (!notes || !question) {
      return NextResponse.json({ error: 'Notes and question are required' }, { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Based on these lecture notes:\n\n${notes}\n\nAnswer this question clearly and concisely: ${question}`,
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

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No answer generated';

    return NextResponse.json({ answer }, { status: 200 });
  } catch (err: any) {
    console.error('Error in ask API:', err);
    return NextResponse.json(
      { error: 'Failed to get answer', details: err.message },
      { status: 500 }
    );
  }
}