import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const quotations = await db.collection('quotations').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('API /api/quotations GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    const newQuotation = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: body.status || 'pending'
    };
    
    const result = await db.collection('quotations').insertOne(newQuotation);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('API /api/quotations POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    await db.collection('quotations').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/quotations PUT error:', error);
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
    
    await db.collection('quotations').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/quotations DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
