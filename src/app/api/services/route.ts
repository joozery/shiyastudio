import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const servicesData = await db.collection('settings').findOne({ type: 'services' });
    
    if (!servicesData) {
      // Default fallback if no data in DB
      return NextResponse.json({
        services: [
          { category: "MARKETING", title: "Influencer Marketing", image: "/service-influencer.png", description: "Strategic influencer campaigns that drive real engagement.", slug: "influencer" },
          { category: "CREATIVE", title: "Creative Production", image: "/service-production.png", description: "High-end visual content production for global brands.", slug: "production" },
          { category: "DESIGN", title: "Graphic Design", image: "/service-graphic.png", description: "Identity and visual systems that define your brand.", slug: "graphic-design" },
          { category: "MOTION", title: "Video & Motion", image: "/service-motion.png", description: "Dynamic storytelling through high-impact motion graphics.", slug: "vdo-motion" },
          { category: "AUDIO", title: "Audio & Music", image: "/service-music.png", description: "Professional sound design and audio post-production.", slug: "mix-master-music" }
        ]
      });
    }
    
    return NextResponse.json(servicesData);
  } catch (error) {
    console.error('API /api/services GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'services' },
      { $set: { ...body, type: 'services', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/services PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
