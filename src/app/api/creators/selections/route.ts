import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAdmin, sameOrigin } from '@/lib/auth';
import { text, validEmail } from '@/lib/creators';
export async function GET() { const denied = await requireAdmin(); if (denied)
    return denied; const rows = await (await clientPromise).db('shiyastudio').collection('creator_selections').find({}).sort({ createdAt: -1 }).limit(500).toArray(); return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } }); }
export async function POST(req: Request) { if (!sameOrigin(req))
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 }); try {
    const data = await req.json();
    const name = text(data.name, 150), email = text(data.email, 150), company = text(data.company, 150), phone = text(data.phone, 30), message = text(data.message, 3000);
    const ids = [...new Set<string>((Array.isArray(data.creatorIds) ? data.creatorIds : []).map((v: unknown) => text(v, 100)).filter(Boolean))].slice(0, 50);
    if (!name || !validEmail(email) || !ids.length)
        return NextResponse.json({ error: 'กรุณากรอกชื่อ อีเมล และเลือกรายชื่อ' }, { status: 400 });
    const db = (await clientPromise).db('shiyastudio');
    const creators = await db.collection('creators').find({ id: { $in: ids }, status: 'approved' }, { projection: { id: 1, author: 1, _id: 0 } }).toArray();
    if (creators.length !== ids.length)
        return NextResponse.json({ error: 'บางรายชื่อไม่พร้อมให้เลือก กรุณาโหลดหน้าใหม่' }, { status: 409 });
    const recent = await db.collection('creator_selections').countDocuments({ email, createdAt: { $gt: new Date(Date.now() - 3600000) } });
    if (recent >= 5)
        return NextResponse.json({ error: 'ส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
    await db.collection('creator_selections').insertOne({ name, email, company, phone, message, creators, status: 'new', createdAt: new Date() });
    return NextResponse.json({ success: true }, { status: 201 });
}
catch {
    return NextResponse.json({ error: 'ส่งรายชื่อไม่สำเร็จ' }, { status: 400 });
} }
