import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}