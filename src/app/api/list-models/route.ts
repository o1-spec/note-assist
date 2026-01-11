import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return NextResponse.json({ error: 'Failed to list models', details: data }, { status: 500 });
    }

    // This will list all models your key can access
    return NextResponse.json({ models: data.models || [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Error listing models', details: err.message }, { status: 500 });
  }
}
