import { NextResponse } from 'next/server';
import {createHash} from 'node:crypto';
import clientPromise from '@/lib/mongodb';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const store = await cookies();
    try { const session = JSON.parse(store.get('admin_session')?.value || '{}'); if (typeof session.token === 'string') await (await clientPromise).db('shiyastudio').collection('admin_sessions').deleteOne({tokenHash:createHash('sha256').update(session.token).digest('hex')}); } catch {}
    store.delete('admin_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
