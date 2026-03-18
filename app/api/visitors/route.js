import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Visitor from "@/app/models/Visitor";
import User from "@/app/models/User";


export async function GET() {
  try {
    await dbConnect();

    const count = await Visitor.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Visitor fetch error:", error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const { visitorId } = await req.json();

    const exists = await Visitor.findOne({ visitorId });

    if (!exists) {
      await Visitor.create({ visitorId });
    }

    const count = await Visitor.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Visitor save error:", error);
    return NextResponse.json({ success: false });
  }
}