import {NextResponse} from 'next/server';
import {GridFSBucket,ObjectId} from 'mongodb';
import sharp from 'sharp';
import clientPromise from '@/lib/mongodb';
import {getAdminSession} from '@/lib/auth';
export const runtime='nodejs';
const thumbnails=new Map<string,{expires:number;body:Buffer}>();
const MAX_BYTES=8*1024*1024;
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 if(!await getAdminSession())return new NextResponse(null,{status:401});
 const {id}=await params;if(!ObjectId.isValid(id))return new NextResponse(null,{status:404});
 try{
  const db=(await clientPromise).db('shiyastudio');
  // Only applicant profile photos, never Media Kits or identity documents.
  const profile=await db.collection('creators').findOne({photoId:id,deletedAt:{$exists:false}},{projection:{_id:1}});
  if(!profile)return new NextResponse(null,{status:404});
  const cached=thumbnails.get(id);
  let body:Buffer;
  if(cached&&cached.expires>Date.now())body=cached.body;
  else{
   thumbnails.delete(id);
   const bucket=new GridFSBucket(db,{bucketName:'creator_files'}),fileId=new ObjectId(id);
   const file=await bucket.find({_id:fileId}).next();
   if(!file||file.length>MAX_BYTES||!['image/jpeg','image/png','image/webp'].includes(file.metadata?.contentType))return new NextResponse(null,{status:404});
   const chunks:Buffer[]=[];let size=0;
   for await(const chunk of bucket.openDownloadStream(fileId)){size+=chunk.length;if(size>MAX_BYTES)throw Error('Image too large');chunks.push(Buffer.from(chunk))}
   body=await sharp(Buffer.concat(chunks),{limitInputPixels:40_000_000}).rotate().resize(128,150,{fit:'cover',withoutEnlargement:true}).webp({quality:72}).toBuffer();
   if(thumbnails.size>=128)thumbnails.delete(thumbnails.keys().next().value!);
   thumbnails.set(id,{body,expires:Date.now()+300_000});
  }
  return new NextResponse(new Uint8Array(body),{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch{return new NextResponse(null,{status:500})}
}
