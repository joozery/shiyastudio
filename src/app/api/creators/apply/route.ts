import { NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import { randomUUID, createHash } from 'node:crypto';
import clientPromise from '@/lib/mongodb';
import { CreatorRecord, text, validEmail, validUrl, Social } from '@/lib/creators';
import { sameOrigin } from '@/lib/auth';
export async function POST(req: Request) {
    if (!sameOrigin(req))
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    if (Number(req.headers.get('content-length') || 0) > 30 * 1024 * 1024)
        return NextResponse.json({ error: 'ไฟล์ใหญ่เกินกำหนด' }, { status: 413 });
    try {
        const form = await req.formData();
        let data;
        try {
            data = JSON.parse(String(form.get('data') || ''));
        }
        catch {
            return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
        }
        if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({error:'ข้อมูลไม่ถูกต้อง'}, {status:400});
        const personal = { prefix:text(data.prefix,100), fullName: text(data.fullName, 150), nickname: text(data.nickname, 100), birthday: text(data.birthday, 10), province: text(data.province, 100), nationality:text(data.nationality,100),district:text(data.district,100),occupation:text(data.occupation,100),address:text(data.address,1000),languages:(Array.isArray(data.languages)?data.languages:[]).map((value:unknown)=>text(value,50)).slice(0,10),otherLanguage:text(data.otherLanguage,100) };
        const contact = { phone: text(data.phone, 30), email: text(data.email, 150).toLowerCase(), line: text(data.line, 100) };
        const author = text(data.author, 100);
        const categories = (Array.isArray(data.categories) ? data.categories : []).map((v: unknown) => text(v, 80)).filter(Boolean).slice(0, 10);
        const socials: Social[] = (Array.isArray(data.socials) ? data.socials : []).slice(0, 5).map((s: Record<string, unknown>) => ({ platform: text(s.platform, 30), url: text(s.url, 1000), followers: text(s.followers, 30), averageViews: text(s.averageViews, 30), engagement: text(s.engagement, 30) })).filter((s: Social) => s.url);
        const portfolio = (Array.isArray(data.portfolio) ? data.portfolio : []).map((v: unknown) => text(v, 1000)).filter(Boolean).slice(0, 10);
        if (!author || !personal.fullName || !personal.nickname || !personal.birthday || !personal.province || !contact.phone || !validEmail(contact.email) || !categories.length || !socials.length || !data.terms || !data.privacy || socials.some(s => !validUrl(s.url)) || portfolio.some((s: string) => !validUrl(s)) || !/^\d{4}-\d{2}-\d{2}$/.test(personal.birthday) || !Number.isFinite(new Date(personal.birthday).getTime()) || new Date(personal.birthday) > new Date())
            return NextResponse.json({ error: 'กรุณาตรวจข้อมูลที่จำเป็น ลิงก์โซเชียล และข้อตกลง' }, { status: 400 });
        const photo = form.get('photo');
        const kit = form.get('mediaKit');
        const identity = form.get('idCard');
        const financial: Record<string,string> = {};
        for (const field of ['bank','accountName','accountNumber','taxId','billingAddress']) financial[field] = text(data[field],field==='billingAddress'?1000:150);
        if (Object.values(financial).some(value=>!value)) return NextResponse.json({error:'กรุณากรอกข้อมูลบัญชีและภาษีให้ครบ'}, {status:400});
        if (!(identity instanceof File) || !identity.size || identity.size>8*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(identity.type)) return NextResponse.json({error:'กรุณาแนบรูปบัตรประชาชน JPG, PNG หรือ WebP ไม่เกิน 8 MB'}, {status:400});
        const identityBuffer=Buffer.from(await identity.arrayBuffer());
        const validIdentity=identity.type==='image/jpeg'?identityBuffer[0]===0xff&&identityBuffer[1]===0xd8&&identityBuffer[2]===0xff:identity.type==='image/png'?identityBuffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):identityBuffer.subarray(0,4).toString()==='RIFF'&&identityBuffer.subarray(8,12).toString()==='WEBP';
        if (!validIdentity) return NextResponse.json({error:'รูปแบบไฟล์บัตรประชาชนไม่ถูกต้อง'}, {status:400});
        if (!(photo instanceof File) || !photo.size || photo.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type))
            return NextResponse.json({ error: 'กรุณาแนบรูป JPG, PNG หรือ WebP ไม่เกิน 8 MB' }, { status: 400 });
        if (kit instanceof File && kit.size && (kit.size > 10 * 1024 * 1024 || kit.type !== 'application/pdf'))
            return NextResponse.json({ error: 'Media Kit ต้องเป็น PDF ไม่เกิน 10 MB' }, { status: 400 });
        const db = (await clientPromise).db('shiyastudio');
        const window = Math.floor(Date.now() / 86400000);
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
        const key = createHash('sha256').update(`${ip}:${window}`).digest('hex');
        const limit = await db.collection('creator_submission_limits').findOneAndUpdate({ _id: key as never }, { $inc: { count: 1 }, $set: { expiresAt: new Date(Date.now() + 2 * 86400000) } }, { upsert: true, returnDocument: 'after' });
        if ((limit?.count || 0) > 20)
            return NextResponse.json({ error: 'ส่งคำขอจำนวนมากเกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
        const bucket = new GridFSBucket(db, { bucketName: 'creator_files' });
        const identityBucket = new GridFSBucket(db, { bucketName: 'creator_identity_files' });
        const creatorId = randomUUID();
        const uploaded: {bucket:GridFSBucket;id:import('mongodb').ObjectId}[] = [];
        const upload = async (file:File,target:GridFSBucket=bucket,buffer?:Buffer) => {
            const stream=target.openUploadStream(randomUUID(),{metadata:{contentType:file.type,creatorId}});
            uploaded.push({bucket:target,id:stream.id});
            await new Promise<void>((resolve,reject)=>{stream.on('finish',resolve);stream.on('error',reject);if(buffer)stream.end(buffer);else file.arrayBuffer().then(value=>stream.end(Buffer.from(value))).catch(reject)});
            return stream.id.toString();
        };
        try {
            const photoId = await upload(photo);
            const idCardFileId = await upload(identity,identityBucket,identityBuffer);
            const mediaKitId = kit instanceof File && kit.size ? await upload(kit) : undefined;
            const rates: Record<string, string> = {};
            for (const name of ['post', 'video', 'story', 'live', 'event'])
                rates[name] = text(data.rates?.[name], 50);
            const profile: CreatorRecord = { id: creatorId, author, img: '', photoId, ...(mediaKitId ? { mediaKitId } : {}), bio: text(data.bio, 2000), categories, gender: text(data.gender, 80), socials, portfolio, rates, personal, contact, status: 'pending', featured: false, createdAt: new Date(), consent: { terms: true, privacy: true, version: '2026-10-08-v2', at: new Date(), termsText: text(data.termsText, 10000), privacyText: text(data.privacyText, 10000) } };
            await db.collection<CreatorRecord>('creators').insertOne(profile);
            await db.collection('creator_finance').insertOne({...financial,creatorId,idCardFileId,idCardUploadedAt:new Date(),idCardUploadedBy:'creator-application',updatedAt:new Date()});
            return NextResponse.json({ success: true }, { status: 201 });
        }
        catch (error) {
            for (const file of uploaded) await file.bucket.delete(file.id).catch(()=>{});
            await db.collection('creators').deleteOne({id:creatorId}).catch(()=>{});
            await db.collection('creator_finance').deleteOne({creatorId}).catch(()=>{});
            throw error;
        }
    }
    catch {
        return NextResponse.json({ error: 'ส่งใบสมัครไม่สำเร็จ กรุณาลองอีกครั้ง' }, { status: 500 });
    }
}
