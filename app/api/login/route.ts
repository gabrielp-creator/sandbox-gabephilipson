import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../lib/supabase';
import { createSessionToken } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (!subscriber) {
      return NextResponse.json(
        { error: 'No account found with that email. Please subscribe first.' },
        { status: 404 }
      );
    }

    const token = createSessionToken(subscriber.id, email);
    const cookieStore = await cookies();
    cookieStore.set('sandbox_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
