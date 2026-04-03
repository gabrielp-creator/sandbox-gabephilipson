import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../lib/supabase';
import { createSessionToken } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, company, role } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    let subscriberId: string;

    if (existing) {
      subscriberId = existing.id;
    } else {
      const { data: newSub, error: insertError } = await supabase
        .from('subscribers')
        .insert({ name, email, company: company || null, role: role || null })
        .select('id')
        .single();

      if (insertError || !newSub) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }

      subscriberId = newSub.id;

      // Send confirmation email via Resend
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Gabriel Philipson <gabe@gabephilipson.com>',
            to: [email],
            subject: 'Sandbox Access Confirmed',
            text: `Thanks for subscribing to the gabephilipson.com sandbox.\n\nYou now have access to request and explore live demos of AI projects in the POC Lab. Visit sandbox.gabephilipson.com to browse available sandboxes.\n\nGabriel Philipson\nIES Consulting Group\ngabephilipson.com`,
          }),
        });
      }
    }

    // Set session cookie
    const token = createSessionToken(subscriberId, email);
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
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
