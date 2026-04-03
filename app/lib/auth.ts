import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const SECRET = process.env.SANDBOX_SECRET || 'sandbox-fallback-secret';

export function createSessionToken(subscriberId: string, email: string): string {
  const payload = `${subscriberId}:${email}`;
  const signature = createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export function verifySessionToken(token: string): { valid: boolean; subscriberId?: string; email?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) return { valid: false };

    const signature = parts.pop()!;
    const email = parts.pop()!;
    const subscriberId = parts.join(':');

    const expectedSignature = createHmac('sha256', SECRET)
      .update(`${subscriberId}:${email}`)
      .digest('hex');

    if (signature !== expectedSignature) return { valid: false };

    return { valid: true, subscriberId, email };
  } catch {
    return { valid: false };
  }
}

export async function getSession(): Promise<{ subscriberId: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sandbox_session')?.value;
  if (!token) return null;

  const result = verifySessionToken(token);
  if (!result.valid || !result.subscriberId || !result.email) return null;

  return { subscriberId: result.subscriberId, email: result.email };
}
