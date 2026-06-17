import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/data/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', success: false },
        { status: 400 }
      );
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials', success: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: `mock-jwt-token-${user.id}-${Date.now()}`
      },
      success: true
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
