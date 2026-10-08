import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import clientPromise from '@/lib/mongodb';
import {getAdminSession,sameOrigin} from '@/lib/auth';
import {text,validUrl,type CreatorRecord} from '@/lib/creators';
import {workStatuses,emptyWorkStats,type CreatorWork,type CreatorWorkDetail} from '@/lib/creator-work';
function detail(profile:CreatorRecord):CreatorWorkDetail{return {creatorId:profile.id,author:profile.author,profileStatus:profile.status,records:profile.workRecords||[],stats:profile.workStats||emptyWorkStats,blacklist:profile.blacklist||null}}
function validDate(value:string){return !value||/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value}
const workStatsStage={$set:{workStats:{
 total:{$size:{$filter:{input:{$ifNull:['$workRecords',[]]},as:'work',cond:{$ne:['$$work.status','cancelled']}}}},
 delivered:{$size:{$filter:{input:{$ifNull:['$workRecords',[]]},as:'work',cond:{$eq:['$$work.status','delivered']}}}},
 missed:{$size:{$filter:{input:{$ifNull:['$workRecords',[]]},as:'work',cond:{$eq:['$$work.status','missed']}}}},
 productOutstanding:{$size:{$filter:{input:{$ifNull:['$workRecords',[]]},as:'work',cond:{$and:[{$eq:['$$work.productReceived',true]},{$not:[{$in:['$$work.status',['delivered','cancelled']]}]}]}}}}
}}};
export async function GET(req:Request){
 if(!await getAdminSession())return NextResponse.json({error:'กรุณาเข้าสู่ระบบ'},{status:401});
 const id=text(new URL(req.url).searchParams.get('id'),100);if(!id)return NextResponse.json({error:'ไม่พบรหัสผู้สมัคร'},{status:400});
 try{const profile=await (await clientPromise).db('shiyastudio').collection<CreatorRecord>('creators').findOne({id,deletedAt:{$exists:false}},{projection:{id:1,author:1,status:1,workRecords:1,workStats:1,blacklist:1}});if(!profile)return NextResponse.json({error:'ไม่พบโปรไฟล์'},{status:404});return NextResponse.json(detail(profile),{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'โหลดประวัติไม่สำเร็จ'},{status:500})}
}
export async function PUT(req:Request){
 const session=await getAdminSession();if(!session)return NextResponse.json({error:'กรุณาเข้าสู่ระบบ'},{status:401});if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});
 try{
  const data=await req.json();if(!data||typeof data!=='object')throw Error();
  const id=text(data.creatorId,100);if(!id)return NextResponse.json({error:'ไม่พบรหัสผู้สมัคร'},{status:400});
  const collection=(await clientPromise).db('shiyastudio').collection<CreatorRecord>('creators');
  const profile=await collection.findOne({id,deletedAt:{$exists:false}},{projection:{id:1,author:1,status:1,workRecords:1,workStats:1,blacklist:1}});if(!profile)return NextResponse.json({error:'ไม่พบโปรไฟล์'},{status:404});
  const now=new Date().toISOString();
  if(data.action==='blacklist'){
   if(typeof data.active!=='boolean')return NextResponse.json({error:'สถานะไม่ถูกต้อง'},{status:400});
   const reason=text(data.reason,3000);if(data.active&&!reason)return NextResponse.json({error:'กรุณาระบุเหตุผลและข้อมูลที่ตรวจสอบแล้วก่อนทำ Blacklist'},{status:400});
   const entry={active:data.active,reason,updatedAt:now,updatedBy:session.email};
   await collection.updateOne({id,deletedAt:{$exists:false}},[{$set:{blacklist:{$literal:entry},...(data.active?{status:'hidden'}:{}),blacklistLog:{$slice:[{$concatArrays:[{$ifNull:['$blacklistLog',[]]},{$literal:[entry]}]},-100]},updatedAt:{$literal:new Date()}}}]);
  }else if(data.action==='saveWork'){
   const work=data.work;if(!work||typeof work!=='object')return NextResponse.json({error:'กรุณากรอกข้อมูลรับงาน'},{status:400});
   const campaign=text(work.campaign,200),brand=text(work.brand,200),acceptedDate=text(work.acceptedDate,10),dueDate=text(work.dueDate,10),receivedDate=text(work.receivedDate,10),notes=text(work.notes,4000),evidenceUrl=text(work.evidenceUrl,1500),status=text(work.status,30);
   if(status==='missed'&&!notes)return NextResponse.json({error:'กรุณาระบุหมายเหตุและผลการติดตามสำหรับกรณีไม่ส่งงาน'},{status:400});
   if(!campaign||!acceptedDate||!Object.hasOwn(workStatuses,status)||typeof work.productReceived!=='boolean'||![acceptedDate,dueDate,receivedDate].every(validDate)||dueDate&&dueDate<acceptedDate||!validUrl(evidenceUrl))return NextResponse.json({error:'กรุณาตรวจชื่อแคมเปญ วันที่รับงาน กำหนดส่ง สถานะ และลิงก์หลักฐาน'},{status:400});
   const workId=text(work.id,100);const existing=workId?profile.workRecords?.find(record=>record.id===workId):undefined;if(workId&&!existing)return NextResponse.json({error:'ไม่พบรายการรับงาน'},{status:404});
   const record:CreatorWork={id:workId||randomUUID(),campaign,brand,acceptedDate,dueDate,receivedDate:work.productReceived?receivedDate:'',productReceived:work.productReceived,status:status as CreatorWork['status'],notes,evidenceUrl,createdAt:existing?.createdAt||now,createdBy:existing?.createdBy||session.email,updatedAt:now,updatedBy:session.email};
   const records=existing?{$map:{input:{$ifNull:['$workRecords',[]]},as:'work',in:{$cond:[{$eq:['$$work.id',{$literal:record.id}]},{$literal:record},'$$work']}}}:{$concatArrays:[{$ifNull:['$workRecords',[]]},{$literal:[record]}]};
   const filter=existing?{id,'workRecords.id':record.id}:{id,$expr:{$lt:[{$size:{$ifNull:['$workRecords',[]]}},500]}};
   const result=await collection.updateOne({...filter,deletedAt:{$exists:false}},[{$set:{workRecords:records,updatedAt:{$literal:new Date()}}},workStatsStage]);if(!result.matchedCount)return NextResponse.json({error:'บันทึกไม่ได้ อาจมีประวัติครบ 500 รายการหรือรายการเปลี่ยนแปลง กรุณาโหลดใหม่'},{status:409});
  }else return NextResponse.json({error:'การดำเนินการไม่ถูกต้อง'},{status:400});
  const updated=await collection.findOne({id,deletedAt:{$exists:false}},{projection:{id:1,author:1,status:1,workRecords:1,workStats:1,blacklist:1}});if(!updated)throw Error();return NextResponse.json(detail(updated),{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'บันทึกข้อมูลไม่สำเร็จ'},{status:400})}
}
