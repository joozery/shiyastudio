import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AdminSession {
  email: string;
  authenticated: true;
}

/**
 * Reads and parses the `admin_session` cookie set by /api/auth/verify-otp.
 * Returns null if missing/invalid/expired.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session?.value) return null;

  try {
    if (session.value.startsWith('{')) {
      const data = JSON.parse(session.value);
      if (data?.authenticated) {
        return { email: data.email, authenticated: true };
      }
      return null;
    }
    if (session.value === 'authenticated') {
      return { email: 'admin@shiyastudio.com', authenticated: true };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Guard for API route handlers. Call at the top of any handler that should
 * only run for a logged-in admin:
 *
 *   const unauthorized = await requireAdmin();
 *   if (unauthorized) return unauthorized;
 *
 * Returns a 401 NextResponse if there is no valid admin session, otherwise null.
 *
 * NOTE: this only protects the specific handler it's called in. The Next.js
 * middleware (src/middleware.ts) does NOT cover /api/* routes (it's excluded
 * from the matcher), so every admin-only API route handler must call this
 * itself - there is no blanket protection at the routing layer.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
