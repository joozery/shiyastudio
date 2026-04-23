import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const clientsData = await db.collection('settings').findOne({ type: 'clients' });
    
    if (!clientsData) {
      return NextResponse.json({
        clients: [
          { name: "Aether", image: "" },
          { name: "Lumina", image: "" },
          { name: "GlobalTech", image: "" },
          { name: "Horizon", image: "" },
          { name: "Vitality", image: "" },
          { name: "Sentinely", image: "" },
          { name: "Zenith", image: "" },
          { name: "Vertex", image: "" }
        ]
      });
    }
    
    return NextResponse.json(clientsData);
  } catch (error) {
    console.error('API /api/clients GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'clients' },
      { $set: { ...body, type: 'clients', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/clients PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
