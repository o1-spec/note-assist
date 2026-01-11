import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Check user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ Get notes from request
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
                  text: `Summarize the following lecture notes clearly and concisely:\n\n${notes}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    // 4️⃣ Handle API errors
    if (!res.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: 'Gemini error', details: data },
        { status: 500 }
      );
    }

    // 5️⃣ Extract summary text
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No summary generated';

    // 6️⃣ Return summary
    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error('Error in summarize API:', err);
    return NextResponse.json(
      { error: 'Failed to summarize', details: err.message },
      { status: 500 }
    );
  }
}
