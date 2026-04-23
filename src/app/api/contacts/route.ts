import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, services, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    const newContact = {
      name,
      email,
      services: services || [],
      message,
      status: 'unread',
      createdAt: new Date()
    };
    
    await db.collection('contacts').insertOne(newContact);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/contacts POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('API /api/contacts GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const { ObjectId } = await import('mongodb');
    
    await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/contacts DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
