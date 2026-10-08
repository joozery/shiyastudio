import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import clientPromise from '@/lib/mongodb';
import { requireAdmin, getAdminSession, sameOrigin } from '@/lib/auth';
import { CreatorRecord, text, validUrl } from '@/lib/creators';
export async function GET(req?:Request) {
    const session=await getAdminSession();
    if(!session)return NextResponse.json({error:'กรุณาเข้าสู่ระบบอีกครั้ง'},{status:401});
    try {
        const db=(await clientPromise).db('shiyastudio');
        const params=req?new URL(req.url).searchParams:null;
        const id=text(params?.get('id'),100);
        if(id){
            const profile=await db.collection<CreatorRecord>('creators').findOne({id,deletedAt:{$exists:false}},{projection:{workRecords:0,blacklistLog:0,'consent.termsText':0,'consent.privacyText':0}});
            return NextResponse.json(profile?{profile}:{error:'ไม่พบโปรไฟล์'},{status:profile?200:404,headers:{'Cache-Control':'no-store'}});
        }
        const list=params?.get('view')==='list';
        const projection=list?{_id:0,id:1,author:1,img:1,photoId:1,categories:1,socials:1,status:1,featured:1,workStats:1,createdAt:1,'personal.fullName':1,'personal.province':1,'contact.email':1,'blacklist.active':1}:{workRecords:0,blacklistLog:0,'consent.termsText':0,'consent.privacyText':0};

        const [profiles,settings]=await Promise.all([
            db.collection<CreatorRecord>('creators').find({deletedAt:{$exists:false}},{projection}).sort({createdAt:-1}).toArray(),
            db.collection('settings').findOne({type:'influencer'},{projection:{_id:0,profileCategories:1,profileGenders:1}})
        ]);
        return NextResponse.json({profiles,canFinance:session.role==='Super Admin',profileCategories:settings?.profileCategories,profileGenders:settings?.profileGenders},{headers:{'Cache-Control':'no-store'}});
    }catch{return NextResponse.json({error:'โหลดรายชื่อไม่สำเร็จ'},{status:500})}
}
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
    const current = await collection.findOne({ id, deletedAt:{$exists:false} });
    if (!current)
        return NextResponse.json({ error: 'ไม่พบโปรไฟล์' }, { status: 404 });
    const merged = { ...current, ...update };
    if (merged.status === 'approved' && current.blacklist?.active) return NextResponse.json({error:'โปรไฟล์นี้อยู่ใน Blacklist กรุณาตรวจสอบและยกเลิกสถานะก่อนเผยแพร่'}, {status:409});
    if (merged.status === 'approved' && (!merged.author.trim() || !merged.categories.length || !merged.socials.some(s => s.url) || !merged.photoId && !merged.img))
        return NextResponse.json({ error: 'ก่อนอนุมัติ กรุณากรอกชื่อ รูป หมวดหมู่ และโซเชียลอย่างน้อยหนึ่งช่องทาง' }, { status: 400 });
    const result = await collection.updateOne({ id, deletedAt:{$exists:false}, ...(update.status==='approved'?{'blacklist.active':{$ne:true}}:{}) }, { $set: update, ...(update.img ? { $unset: { photoId: '' } } : {}) });
    if(!result.matchedCount&&update.status==='approved')return NextResponse.json({error:'ไม่สามารถเผยแพร่ได้ กรุณาตรวจสถานะ Blacklist และโหลดข้อมูลใหม่'},{status:409});
    return NextResponse.json({ success: !!result.matchedCount }, { status: result.matchedCount ? 200 : 404 });
}
catch {
    return NextResponse.json({ error: 'บันทึกไม่สำเร็จ' }, { status: 400 });
} }

export async function DELETE(req:Request){const denied=await requireAdmin();if(denied)return denied;if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});try{const data=await req.json();const id=text(data?.id,100);if(!id)return NextResponse.json({error:'Missing id'},{status:400});const result=await (await clientPromise).db('shiyastudio').collection('creators').updateOne({id,deletedAt:{$exists:false}},{$set:{deletedAt:new Date(),status:'hidden',featured:false,updatedAt:new Date()}});return NextResponse.json(result.matchedCount?{success:true}:{error:'ไม่พบโปรไฟล์'},{status:result.matchedCount?200:404})}catch{return NextResponse.json({error:'ลบโปรไฟล์ไม่สำเร็จ'},{status:400})}}
