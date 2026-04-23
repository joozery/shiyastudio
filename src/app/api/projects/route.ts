import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const projectsData = await db.collection('settings').findOne({ type: 'projects' });
    
    if (!projectsData) {
      return NextResponse.json({
        projects: [
          { id: 1, title: "AETHER BRANDING", category: "IDENTITY / CONCEPT", coverImage: "/project-1.png", description: "Reimagining modern minimalism for global luxury brands.", media: [] },
          { id: 2, title: "LUMINA DIGITAL", category: "MOTION / 3D SCULPT", coverImage: "/project-2.png", description: "Creating liquid visual identities for futuristic ecosystems.", media: [] },
          { id: 3, title: "GENESIS CAMPAIGN", category: "PRODUCTION / AD", coverImage: "/project-3.png", description: "High-octane commercial production with cinematic lens.", media: [] }
        ]
      });
    }
    
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error('API /api/projects GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('settings').updateOne(
      { type: 'projects' },
      { $set: { ...body, type: 'projects', updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/projects PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
