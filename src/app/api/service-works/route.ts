import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// NOTE: GET is intentionally public - it's also consumed by the public
// /services/* marketing pages to render the portfolio. Only mutations (PUT)
// are admin-only.

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const worksData = await db.collection('settings').findOne({ type: 'service-works' });
    
    if (!worksData) {
      return NextResponse.json({
        services: {
          'influencer': [],
          'production': [],
          'graphic-design': [],
          'vdo-motion': [],
          'mix-master-music': []
        }
      });
    }
    
    return NextResponse.json(worksData);
  } catch (error) {
    console.error('API /api/service-works GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'service-works' },
      { $set: { ...body, type: 'service-works', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/service-works PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
