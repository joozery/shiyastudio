import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { canManageCreatorFinance, sameOrigin, getAdminSession } from '@/lib/auth';
import { text } from '@/lib/creators';
export async function GET(req: Request) { if (!await canManageCreatorFinance())
    return NextResponse.json({ error: 'เฉพาะ Super Admin' }, { status: 403 }); const id = new URL(req.url).searchParams.get('id'); const data = await (await clientPromise).db('shiyastudio').collection('creator_finance').findOne({ creatorId: id }, { projection: { _id: 0 } }); return NextResponse.json(data || {}, { headers: { 'Cache-Control': 'no-store' } }); }
export async function PUT(req: Request) { if (!await canManageCreatorFinance())
    return NextResponse.json({ error: 'เฉพาะ Super Admin' }, { status: 403 }); if (!sameOrigin(req))
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 }); const data = await req.json(); const id = text(data.creatorId, 100); const db = (await clientPromise).db('shiyastudio'); const profile = await db.collection('creators').findOne({ id }); if (!profile)
    return NextResponse.json({ error: 'ไม่พบโปรไฟล์' }, { status: 400 }); const fields: Record<string, string> = {}; for (const key of ['bank', 'accountName', 'accountNumber', 'taxId', 'billingAddress'])
    fields[key] = text(data[key], key === 'billingAddress' ? 1000 : 150); await db.collection('creator_finance').updateOne({ creatorId: id }, { $set: { ...fields, updatedAt: new Date(), updatedBy: (await getAdminSession())?.email } }, { upsert: true }); return NextResponse.json({ success: true }); }
