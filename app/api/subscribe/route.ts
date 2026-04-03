import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { createHmac } from 'crypto';

const SECRET = process.env.SANDBOX_SECRET || 'sandbox-fallback-secret';

function createVerifyToken(name: string, email: string, company: string, role: string): string {
  const expires = Date.now() + 48 * 60 * 60 * 1000;
  const payload = JSON.stringify({ name, email, company, role, expires });
  const signature = createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

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

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already subscribed. Use the log in form below.' },
        { status: 409 }
      );
    }

    // Send verification email
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const token = createVerifyToken(name, email, company || '', role || '');
    const confirmUrl = `https://sandbox.gabephilipson.com/api/confirm?token=${token}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Gabriel Philipson <gabe@gabephilipson.com>',
        to: [email],
        subject: 'Confirm your sandbox access',
        html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <div style="border-bottom: 2px solid #005C8F; padding-bottom: 16px; margin-bottom: 24px;">
    <strong style="color: #005C8F; font-size: 14px; letter-spacing: 0.04em;">GABRIEL PHILIPSON</strong>
  </div>
  <h1 style="font-size: 22px; margin-bottom: 12px;">Confirm your sandbox access</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #555;">
    Click the button below to verify your email and activate your sandbox subscription.
  </p>
  <a href="${confirmUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 28px; background: #005C8F; color: #fff; text-decoration: none; border-radius: 3px; font-size: 14px;">Confirm Subscription</a>
  <p style="margin-top: 24px; font-size: 13px; color: #888; line-height: 1.5;">
    If you did not request this, you can safely ignore this email. This link expires in 48 hours.
  </p>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, verify: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
