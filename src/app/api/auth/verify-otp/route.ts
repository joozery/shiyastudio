import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    // Find valid OTP
    const record = await db.collection('otp_codes').findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (record) {
      // OTP is valid, clear it
      await db.collection('otp_codes').deleteOne({ _id: record._id });

      // Set session cookie with email info
      (await cookies()).set('admin_session', JSON.stringify({ email: record.email, authenticated: true }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
  } catch (error) {
    console.error('API /api/auth/verify-otp error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
