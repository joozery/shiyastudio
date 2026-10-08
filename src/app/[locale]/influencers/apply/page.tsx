import clientPromise from '@/lib/mongodb';
import {defaultCategories,defaultGenders} from '@/lib/creators';
import {defaultApplicantTerms,defaultApplicantPrivacy} from '@/lib/creator-application-settings';
import ApplicationForm from './ApplicationForm';
export const metadata={title:'สมัคร Influencer — SHIYA STUDIO'};
export const dynamic='force-dynamic';
export default async function ApplyPage(){const db=(await clientPromise).db('shiyastudio');const settings=await db.collection('settings').findOne({type:'influencer'},{projection:{profileCategories:1,profileGenders:1,applicantTerms:1,applicantPrivacy:1}});return <ApplicationForm categories={settings?.profileCategories||defaultCategories} genders={settings?.profileGenders||defaultGenders} terms={settings?.applicantTerms||defaultApplicantTerms} privacy={settings?.applicantPrivacy||defaultApplicantPrivacy}/>}
