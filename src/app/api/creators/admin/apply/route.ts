import {NextResponse} from 'next/server';
import {getAdminSession} from '@/lib/auth';
import {saveCreatorApplication} from '@/lib/creator-application';
export async function POST(req:Request){
 const session=await getAdminSession();
 if(!session)return NextResponse.json({error:'กรุณาเข้าสู่ระบบอีกครั้ง'},{status:401});
 return saveCreatorApplication(req,{email:session.email});
}
