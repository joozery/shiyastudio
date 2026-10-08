import type { Metadata } from 'next';
import clientPromise from '@/lib/mongodb';
import { publicCreator, type CreatorRecord } from '@/lib/creators';
import InfluencersClient, { type Creator } from './InfluencersClient';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Influencers & Creators', description: 'Explore the creators and influencer content at SHIYA STUDIO.' };

export default async function InfluencersPage() {
  const client = await clientPromise;
  const serviceSettings = await client.db('shiyastudio').collection('settings').findOne({ type: 'services' }, { projection: { services: 1 } });
  const service = serviceSettings?.services?.find((item: { slug: string }) => item.slug === 'influencer');
  const heroImage = typeof service?.image === 'string' ? service.image : '';
  const settings = await client.db('shiyastudio').collection('settings').findOne({ type: 'influencer' }, { projection: { profiles: 1, profileCategories: 1, profileGenders: 1 } });
  const profiles = await client.db('shiyastudio').collection<CreatorRecord>('creators').find({status:'approved'}).sort({featured:-1,createdAt:-1}).toArray();
  const items: Creator[] = profiles.map(publicCreator);
  return <InfluencersClient items={items} heroImage={heroImage} configuredCategories={Array.isArray(settings?.profileCategories) ? settings.profileCategories : ['Beauty','Fashion','Lifestyle','Food','Travel','Tech','Health','Pet','Business']} configuredGenders={Array.isArray(settings?.profileGenders) ? settings.profileGenders : ['หญิง','ชาย','ไม่ระบุ']}/>;
}
