import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, originalNotes, summary, questions, category } = await req.json();
    
    await connectToDatabase();

    const note = new Note({
      userId: session.user.id,
      title,
      originalNotes,
      summary,
      questions,
      category: category || 'General',
    });
    
    await note.save();

    return NextResponse.json({ message: 'Note saved successfully', note }, { status: 201 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}