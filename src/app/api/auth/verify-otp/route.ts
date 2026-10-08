import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'node:crypto';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (typeof email !== 'string' || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) return NextResponse.json({ error: 'Invalid verification' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    // Find valid OTP
    const record = await db.collection('otp_codes').findOneAndDelete({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (record) {
      // OTP is valid, clear it


      if (!await db.collection('users').findOne({email:record.email}) && record.email === process.env.ADMIN_EMAIL) await db.collection('users').insertOne({email:record.email,name:'Super Admin',role:'Super Admin',status:'active',createdAt:new Date()});
      const token = randomBytes(32).toString('hex');
      await db.collection('admin_sessions').insertOne({ tokenHash: createHash('sha256').update(token).digest('hex'), email: record.email, expiresAt: new Date(Date.now() + 7 * 86400000) });
      // Set verified session cookie
      (await cookies()).set('admin_session', JSON.stringify({ email: record.email, authenticated: true, token }), {
        httpOnly: true,
        sameSite: 'lax',
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
