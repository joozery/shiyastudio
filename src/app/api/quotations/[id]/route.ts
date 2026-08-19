import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Public on purpose: this is what the customer-facing /quotations/[id]/print
// page calls. It only ever returns the single quotation requested by id -
// never the full list - so a client (or anyone with a print link) can't see
// other clients' quotations.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const quotation = await db.collection('quotations').findOne({ _id: new ObjectId(id) });

    if (!quotation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('API /api/quotations/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
