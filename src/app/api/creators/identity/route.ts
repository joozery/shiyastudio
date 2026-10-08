import { NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { canManageCreatorFinance, getAdminSession, sameOrigin } from '@/lib/auth';
import { text } from '@/lib/creators';

// Identity documents use a separate private bucket. The public media route never reads it.
export async function GET(req: Request) {
    if (!await canManageCreatorFinance()) return NextResponse.json({ error: 'เฉพาะ Super Admin' }, { status: 403 });
    const creatorId = new URL(req.url).searchParams.get('creatorId');
    const db = (await clientPromise).db('shiyastudio');
    const record = await db.collection('creator_finance').findOne({ creatorId }, { projection: { idCardFileId: 1 } });
    if (!record?.idCardFileId || !ObjectId.isValid(record.idCardFileId)) return new NextResponse(null, { status: 404 });
    const bucket = new GridFSBucket(db, { bucketName: 'creator_identity_files' });
    const file = await bucket.find({ _id: new ObjectId(record.idCardFileId) }).next();
    if (!file) return new NextResponse(null, { status: 404 });
    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(file._id)) chunks.push(Buffer.from(chunk));
    return new NextResponse(Buffer.concat(chunks), { headers: {
        'Content-Type': file.metadata?.contentType || 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="identity-document"',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
    } });
}

export async function POST(req: Request) {
    if (!await canManageCreatorFinance()) return NextResponse.json({ error: 'เฉพาะ Super Admin' }, { status: 403 });
    if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    if (Number(req.headers.get('content-length') || 0) > 10 * 1024 * 1024) return NextResponse.json({ error: 'ไฟล์ใหญ่เกินกำหนด' }, { status: 413 });
    try {
        const form = await req.formData();
        const creatorId = text(form.get('creatorId'), 100);
        const file = form.get('file');
        if (!creatorId || !(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            return NextResponse.json({ error: 'กรุณาใช้รูป JPG, PNG หรือ WebP ไม่เกิน 8 MB' }, { status: 400 });
        }
        const db = (await clientPromise).db('shiyastudio');
        const creator = await db.collection('creators').findOne({ id: creatorId });
        if (!creator) return NextResponse.json({ error: 'ไม่พบโปรไฟล์' }, { status: 400 });
        const buffer = Buffer.from(await file.arrayBuffer());
        const valid = file.type === 'image/jpeg' ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
            : file.type === 'image/png' ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
        if (!valid) return NextResponse.json({ error: 'รูปแบบไฟล์รูปภาพไม่ถูกต้อง' }, { status: 400 });
        const bucket = new GridFSBucket(db, { bucketName: 'creator_identity_files' });
        const stream = bucket.openUploadStream('identity-document', { metadata: { contentType: file.type, creatorId } });
        const previous = await db.collection('creator_finance').findOne({ creatorId }, { projection: { idCardFileId: 1 } });
        try {
            await new Promise<void>((resolve, reject) => { stream.on('finish', resolve); stream.on('error', reject); stream.end(buffer); });
            await db.collection('creator_finance').updateOne({ creatorId }, { $set: {
                idCardFileId: stream.id.toString(), idCardUploadedAt: new Date(),
                idCardUploadedBy: (await getAdminSession())?.email,
            } }, { upsert: true });
        } catch (error) { await bucket.delete(stream.id).catch(() => {}); throw error; }
        if (previous?.idCardFileId && ObjectId.isValid(previous.idCardFileId)) await bucket.delete(new ObjectId(previous.idCardFileId)).catch(() => {});
        return NextResponse.json({ success: true, idCardFileId: stream.id.toString() });
    } catch { return NextResponse.json({ error: 'อัปโหลดเอกสารไม่สำเร็จ' }, { status: 500 }); }
}
