import { NextResponse } from 'next/server';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { sandbox_slug } = await request.json();
    if (!sandbox_slug) {
      return NextResponse.json({ error: 'Sandbox slug is required' }, { status: 400 });
    }

    // Check if already has access
    const { data: existing } = await supabase
      .from('sandbox_access')
      .select('id')
      .eq('subscriber_id', session.subscriberId)
      .eq('sandbox_slug', sandbox_slug)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, already_approved: true });
    }

    // Create access record (auto-approved)
    const { error: insertError } = await supabase
      .from('sandbox_access')
      .insert({
        subscriber_id: session.subscriberId,
        sandbox_slug,
        status: 'approved',
        approved_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Access insert error:', insertError);
      return NextResponse.json({ error: 'Failed to request access' }, { status: 500 });
    }

    // Get subscriber info for notification email
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('name, email, company, role')
      .eq('id', session.subscriberId)
      .single();

    // Get sandbox name
    const { data: sandbox } = await supabase
      .from('sandboxes')
      .select('name')
      .eq('slug', sandbox_slug)
      .single();

    // Send notification email to Gabriel
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && subscriber) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Sandbox Notifications <gabe@gabephilipson.com>',
          to: ['gabe@iesgroupco.com'],
          subject: `Sandbox Access Request: ${sandbox?.name || sandbox_slug}`,
          text: `New sandbox access request:\n\nName: ${subscriber.name}\nEmail: ${subscriber.email}\nCompany: ${subscriber.company || 'Not provided'}\nRole: ${subscriber.role || 'Not provided'}\nSandbox: ${sandbox?.name || sandbox_slug}\nRequested: ${new Date().toISOString()}\n\nStatus: Auto-approved`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
