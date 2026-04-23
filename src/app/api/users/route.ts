import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      // Seed initial admin from ENV if empty
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'zerryboy28@gmail.com';
      const ADMIN_PASS = process.env.ADMIN_PASS || 'joozery1234';
      
      const defaultAdmin = {
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        role: 'Super Admin',
        status: 'active',
        createdAt: new Date(),
        lastActive: 'Active Now'
      };
      
      await db.collection('users').insertOne(defaultAdmin);
      const seededUsers = await db.collection('users').find({}).toArray();
      return NextResponse.json(seededUsers);
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('API /api/users GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    
    const newUser = {
      ...body,
      createdAt: new Date(),
      status: 'active'
    };
    
    const result = await db.collection('users').insertOne(newUser);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('API /api/users POST error:', error);
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
    
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/users DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('shiyastudio');

    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/users PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
