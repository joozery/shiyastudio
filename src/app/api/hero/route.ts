import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const heroSettings = await db.collection('settings').findOne({ type: 'hero' });
    
    if (!heroSettings) {
      return NextResponse.json({
        slides: [
          { id: 1, img: '/hero_branding_new.png', type: 'branding' },
          { id: 2, img: '/hero_content_new.png', type: 'content' },
          { id: 3, img: '/hero_strategy_new.png', type: 'strategy' }
        ]
      });
    }
    
    return NextResponse.json(heroSettings);
  } catch (error) {
    console.error('API /api/hero GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'hero' },
      { $set: { ...body, type: 'hero', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/hero PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
