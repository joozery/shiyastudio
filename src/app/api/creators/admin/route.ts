import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import clientPromise from '@/lib/mongodb';
import { requireAdmin, canManageCreatorFinance, sameOrigin } from '@/lib/auth';
import { CreatorRecord, text, validUrl } from '@/lib/creators';
export async function GET() { const denied = await requireAdmin(); if (denied)
    return denied; const db = (await clientPromise).db('shiyastudio'); const [profiles, canFinance] = await Promise.all([db.collection<CreatorRecord>('creators').find({}).sort({ createdAt: -1 }).toArray(), canManageCreatorFinance()]); return NextResponse.json({ profiles, canFinance }, { headers: { 'Cache-Control': 'no-store' } }); }
export async function POST(req: Request) { const denied = await requireAdmin(); if (denied)
    return denied; if (!sameOrigin(req))
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 }); const profile: CreatorRecord = { id: randomUUID(), author: 'โปรไฟล์ใหม่', img: '', bio: '', categories: [], gender: '', socials: [], portfolio: [], rates: {}, personal: { fullName: '', nickname: '', birthday: '', province: '' }, contact: { phone: '', email: '', line: '' }, status: 'pending', featured: false, createdAt: new Date(), consent: { terms: false, privacy: false, version: 'staff-created', at: new Date() } }; await (await clientPromise).db('shiyastudio').collection<CreatorRecord>('creators').insertOne(profile); return NextResponse.json({ profile }, { status: 201 }); }
export async function PATCH(req: Request) { const denied = await requireAdmin(); if (denied)
    return denied; if (!sameOrigin(req))
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 }); try {
    const data = await req.json();
    const id = text(data.id, 100);
    if (!id)
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const update: Partial<CreatorRecord> = { updatedAt: new Date() };
    for (const field of ['author', 'bio', 'gender', 'img'] as const)
        if (field in data)
            update[field] = text(data[field], field === 'bio' ? 2000 : 1000);
    if (data.status) {
        if (!['pending', 'approved', 'rejected', 'hidden'].includes(data.status))
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        update.status = data.status;
    }
    if (typeof data.featured === 'boolean')
        update.featured = data.featured;
    if (Array.isArray(data.categories))
        update.categories = data.categories.map((v: unknown) => text(v, 80)).filter(Boolean).slice(0, 10);
    if (Array.isArray(data.portfolio))
        update.portfolio = data.portfolio.map((v: unknown) => text(v, 1000)).filter(Boolean).slice(0, 10);
    if (Array.isArray(data.socials))
        update.socials = data.socials.slice(0, 5).map((s: Record<string, unknown>) => ({ platform: text(s.platform, 30), url: text(s.url, 1000), followers: text(s.followers, 30), averageViews: text(s.averageViews, 30), engagement: text(s.engagement, 30) }));
    if (update.socials?.some(s => !validUrl(s.url)) || update.portfolio?.some(v => !validUrl(v)) || update.img && !validUrl(update.img) && !update.img.startsWith('/'))
        return NextResponse.json({ error: 'กรุณาใช้ลิงก์ http หรือ https' }, { status: 400 });
    if (data.rates) {
        update.rates = {};
        for (const field of ['post', 'video', 'story', 'live', 'event'])
            update.rates[field] = text(data.rates[field], 50);
    }
    if (data.personal)
        update.personal = { prefix:text(data.personal.prefix,100), fullName: text(data.personal.fullName, 150), nickname: text(data.personal.nickname, 100), birthday: text(data.personal.birthday, 10), province: text(data.personal.province, 100),nationality:text(data.personal.nationality,100),district:text(data.personal.district,100),occupation:text(data.personal.occupation,100),address:text(data.personal.address,1000),languages:(Array.isArray(data.personal.languages)?data.personal.languages:[]).map((value:unknown)=>text(value,50)).slice(0,10),otherLanguage:text(data.personal.otherLanguage,100) };
    if (data.contact)
        update.contact = { phone: text(data.contact.phone, 30), email: text(data.contact.email, 150), line: text(data.contact.line, 100) };
    const collection = (await clientPromise).db('shiyastudio').collection<CreatorRecord>('creators');
    const current = await collection.findOne({ id });
    if (!current)
        return NextResponse.json({ error: 'ไม่พบโปรไฟล์' }, { status: 404 });
    const merged = { ...current, ...update };
    if (merged.status === 'approved' && (!merged.author.trim() || !merged.categories.length || !merged.socials.some(s => s.url) || !merged.photoId && !merged.img))
        return NextResponse.json({ error: 'ก่อนอนุมัติ กรุณากรอกชื่อ รูป หมวดหมู่ และโซเชียลอย่างน้อยหนึ่งช่องทาง' }, { status: 400 });
    const result = await collection.updateOne({ id }, { $set: update, ...(update.img ? { $unset: { photoId: '' } } : {}) });
    return NextResponse.json({ success: !!result.matchedCount }, { status: result.matchedCount ? 200 : 404 });
}
catch {
    return NextResponse.json({ error: 'บันทึกไม่สำเร็จ' }, { status: 400 });
} }
