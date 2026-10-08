import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import ProfileClient from './ProfileClient';
import {publicCreator,type CreatorRecord} from '@/lib/creators';
export const dynamic='force-dynamic';
export default async function ProfilePage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; const client=await clientPromise;
 const profile=await client.db('shiyastudio').collection<CreatorRecord>('creators').findOne({id,status:'approved','blacklist.active':{$ne:true}});
 if(!profile)notFound();
 return <ProfileClient creator={publicCreator(profile)}/>;
}
