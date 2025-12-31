import  dbConnect  from "@/lib/db";
import mongoose from "mongoose";

const TestUserSchema = new mongoose.Schema(
  { name: String, phone: String, address: String },
  { timestamps: true }
);

const TestUser =
  mongoose.models.TestUser || mongoose.model("TestUser", TestUserSchema);

export async function GET() {
  await dbConnect();

  const doc = await TestUser.create({
    name: "Test User",
    phone: "9999999999",
    address: "Test Address",
  });

  return Response.json({ ok: true, doc });
}