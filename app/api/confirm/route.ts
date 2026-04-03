import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import { supabase } from '../../lib/supabase';
import { createSessionToken } from '../../lib/auth';

const SECRET = process.env.SANDBOX_SECRET || 'sandbox-fallback-secret';

function verifyToken(token: string): { valid: boolean; name?: string; email?: string; company?: string; role?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const lastColon = decoded.lastIndexOf(':');
    const payload = decoded.slice(0, lastColon);
    const signature = decoded.slice(lastColon + 1);

    const expectedSignature = createHmac('sha256', SECRET).update(payload).digest('hex');
    if (signature !== expectedSignature) return { valid: false };

    const data = JSON.parse(payload);
    if (Date.now() > data.expires) return { valid: false };

    return { valid: true, name: data.name, email: data.email, company: data.company, role: data.role };
  } catch {
    return { valid: false };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(resultPage('Invalid confirmation link.', false), {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  const result = verifyToken(token);
  if (!result.valid || !result.email) {
    return new NextResponse(resultPage('This link has expired or is invalid. Please subscribe again.', false), {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  try {
    // Check if already exists (in case they click twice)
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', result.email)
      .single();

    let subscriberId: string;

    if (existing) {
      subscriberId = existing.id;
    } else {
      const { data: newSub, error: insertError } = await supabase
        .from('subscribers')
        .insert({
          name: result.name,
          email: result.email,
          company: result.company || null,
          role: result.role || null,
        })
        .select('id')
        .single();

      if (insertError || !newSub) {
        console.error('Insert error:', insertError);
        return new NextResponse(resultPage('Something went wrong. Please try again.', false), {
          headers: { 'Content-Type': 'text/html' },
          status: 500,
        });
      }

      subscriberId = newSub.id;

      // Send welcome email
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
            to: [result.email],
            subject: 'Sandbox Access Confirmed',
            text: `Thanks for subscribing to the gabephilipson.com sandbox.\n\nYou now have access to request and explore live demos of AI projects in the POC Lab. Visit sandbox.gabephilipson.com to browse available sandboxes.\n\nGabriel Philipson\nIES Consulting Group\ngabephilipson.com`,
          }),
        });
      }
    }

    // Set session cookie
    const sessionToken = createSessionToken(subscriberId, result.email);
    const cookieStore = await cookies();
    cookieStore.set('sandbox_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    // Redirect to directory
    return NextResponse.redirect(new URL('/directory', request.url));
  } catch (error) {
    console.error('Confirm error:', error);
    return new NextResponse(resultPage('Something went wrong. Please try again.', false), {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    });
  }
}

function resultPage(message: string, success: boolean) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? 'Confirmed' : 'Error'} | Gabriel Philipson</title>
  <style>
    body { font-family: 'Abel', Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f8fb; color: #1a1a1a; }
    .card { text-align: center; padding: 2rem; max-width: 400px; }
    .msg { font-size: 16px; line-height: 1.5; color: ${success ? '#1a6b35' : '#c62828'}; }
    a { color: #005C8F; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <p class="msg">${message}</p>
    <p><a href="https://sandbox.gabephilipson.com">Back to sandbox</a></p>
  </div>
</body>
</html>`;
}
