import { NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getAdminSession } from '@/lib/auth';
export async function GET(req: Request, { params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; if (!ObjectId.isValid(id))
    return new NextResponse(null, { status: 404 }); const db = (await clientPromise).db('shiyastudio'); const publicPhoto = await db.collection('creators').findOne({ photoId: id, status: 'approved', 'blacklist.active': {$ne: true} }, { projection: { _id: 1 } }); if (!publicPhoto && !await getAdminSession())
    return new NextResponse(null, { status: 404 }); const bucket = new GridFSBucket(db, { bucketName: 'creator_files' }); const file = await bucket.find({ _id: new ObjectId(id) }).next(); if (!file)
    return new NextResponse(null, { status: 404 }); const chunks: Buffer[] = []; for await (const chunk of bucket.openDownloadStream(new ObjectId(id)))
    chunks.push(Buffer.from(chunk)); return new NextResponse(Buffer.concat(chunks), { headers: { 'Content-Type': file.metadata?.contentType || 'application/octet-stream', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': file.metadata?.contentType === 'application/pdf' ? 'attachment; filename="media-kit.pdf"' : 'inline' } }); }
