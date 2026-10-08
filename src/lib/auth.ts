import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import clientPromise from './mongodb';
export interface AdminSession {
    email: string;
    authenticated: true;
}
export async function getAdminSession(): Promise<AdminSession | null> {
    try {
        const value = (await cookies()).get('admin_session')?.value;
        if (!value)
            return null;
        const parsed = JSON.parse(value);
        if (typeof parsed.token !== 'string' || !/^[a-f0-9]{64}$/.test(parsed.token))
            return null;
        const db = (await clientPromise).db('shiyastudio');
        const session = await db.collection('admin_sessions').findOne({ tokenHash: createHash('sha256').update(parsed.token).digest('hex'), expiresAt: { $gt: new Date() } });
        if (!session)
            return null;
        const user = await db.collection('users').findOne({ email: session.email, status: { $ne: 'inactive' } }, { projection: { email: 1 } });
        if (!user)
            return null;
        return { email: user.email, authenticated: true };
    }
    catch {
        return null;
    }
}
export async function requireAdmin() { return await getAdminSession() ? null : NextResponse.json({ error: 'กรุณาเข้าสู่ระบบอีกครั้ง' }, { status: 401 }); }
export async function canManageCreatorFinance() { const session = await getAdminSession(); if (!session)
    return false; const user = await (await clientPromise).db('shiyastudio').collection('users').findOne({ email: session.email }, { projection: { role: 1 } }); return user?.role === 'Super Admin'; }
export function sameOrigin(req: Request) { const origin = req.headers.get('origin'); return !origin || origin === new URL(req.url).origin; }
