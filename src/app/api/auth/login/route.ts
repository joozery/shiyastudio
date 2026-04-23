import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Check Primary Admin from ENV (Bypass/SuperAdmin)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'zerryboy28@gmail.com';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'joozery1234';

    let userFound = false;

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      userFound = true;
    } else {
      // 2. Check other admins from MongoDB
      const client = await clientPromise;
      const db = client.db('shiyastudio');
      const user = await db.collection('users').findOne({ email, password });
      if (user) userFound = true;
    }

    if (userFound) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const client = await clientPromise;
      const db = client.db('shiyastudio');
      
      // Store OTP in database with expiration (5 minutes)
      await db.collection('otp_codes').updateOne(
        { email },
        { 
          $set: { 
            otp, 
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
          } 
        },
        { upsert: true }
      );

      // Send OTP via Resend
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789') {
        try {
          await resend.emails.send({
            from: 'Shiya Console <onboarding@resend.dev>',
            to: email,
            subject: 'Shiya Console Verification Code',
            html: `
              <div style="font-family: sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
                <h1 style="color: #2563eb; margin-bottom: 20px;">Verification Code</h1>
                <p style="font-size: 14px; color: #555;">Use the following code to complete your login to Shiya Console:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0; display: inline-block;">
                  ${otp}
                </div>
                <p style="font-size: 12px; color: #999;">This code will expire in 5 minutes.</p>
              </div>
            `
          });
        } catch (mailError) {
          console.error('Failed to send email:', mailError);
        }
      } else {
        console.log(`[OTP DEBUG] No Resend API Key. OTP for ${email} is: ${otp}`);
      }

      return NextResponse.json({ success: true, requireOtp: true });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('API /api/auth/login POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
