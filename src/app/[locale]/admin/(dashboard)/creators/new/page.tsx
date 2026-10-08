import {Link} from '@/navigation';
import clientPromise from '@/lib/mongodb';
import {defaultCategories,defaultGenders} from '@/lib/creators';
import {defaultApplicantTerms,defaultApplicantPrivacy} from '@/lib/creator-application-settings';
import ApplicationForm from '@/app/[locale]/influencers/apply/ApplicationForm';
export const metadata={title:'เพิ่มโปรไฟล์ Influencer — SHIYA STUDIO'};
export const dynamic='force-dynamic';
export default async function NewCreatorPage(){
 const settings=await (await clientPromise).db('shiyastudio').collection('settings').findOne({type:'influencer'},{projection:{profileCategories:1,profileGenders:1,applicantTerms:1,applicantPrivacy:1}});
 return <div className="admin-page space-y-6"><header className="admin-page-header flex flex-wrap justify-between gap-4"><div><h1 className="text-2xl font-bold">เพิ่มโปรไฟล์ Influencer</h1><p className="mt-2 text-sm text-slate-700">กรอกข้อมูลแทนผู้สมัครด้วยแบบฟอร์ม 6 ขั้นตอน · บันทึกเป็นสถานะรออนุมัติ</p></div><Link href="/admin/creators" className="text-sm font-semibold text-blue-700">← กลับไปรายชื่อ</Link></header><ApplicationForm admin categories={settings?.profileCategories||defaultCategories} genders={settings?.profileGenders||defaultGenders} terms={settings?.applicantTerms||defaultApplicantTerms} privacy={settings?.applicantPrivacy||defaultApplicantPrivacy}/></div>
}
