import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      if (session.value.startsWith('{')) {
        const userData = JSON.parse(session.value);
        return NextResponse.json({ ...userData, authenticated: true });
      } else if (session.value === 'authenticated') {
        return NextResponse.json({ email: 'admin@shiyastudio.com', authenticated: true });
      }
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
