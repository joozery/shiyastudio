import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("shiyastudio");
    
    // Ping the database
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to MongoDB!" 
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
