import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const influencerData = await db.collection('settings').findOne({ type: 'influencer' });
    
    if (!influencerData) {
      return NextResponse.json({
        items: [
          { id: 1, img: "/project-1.png", videoUrl: "", author: "@aomiws", size: "tall", category: "Influencer campaign", platform: "TikTok" },
          { id: 2, img: "/project-2.png", videoUrl: "", author: "@cchanatt", size: "medium", category: "Influencer commerce", platform: "TikTok" },
          { id: 3, img: "/project-3.png", videoUrl: "", author: "@khunkooktayada", size: "tall", category: "Always-on KOL campaign", platform: "Instagram" },
          { id: 4, img: "/service-production.png", videoUrl: "", author: "@shiya.studio", size: "large", category: "Live commerce", platform: "TikTok" },
          { id: 5, img: "/service-motion.png", videoUrl: "", author: "@expert.th", size: "medium", category: "Affiliate marketing", platform: "YouTube" },
          { id: 6, img: "/service-influencer.png", videoUrl: "", author: "@lifestyle.th", size: "tall", category: "Influencer campaign", platform: "Instagram" }
        ],
        categories: [
          "Influencer campaign",
          "Influencer commerce",
          "Always-on KOL campaign",
          "Live commerce",
          "Affiliate marketing"
        ]
      });
    }
    
    return NextResponse.json(influencerData);
  } catch (error) {
    console.error('API /api/influencer GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'influencer' },
      { $set: { ...body, type: 'influencer', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/influencer PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
