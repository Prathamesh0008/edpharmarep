// app/api/test/db-test/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function GET() {
  try {
    console.log("🧪 Testing database connection and updates...");
    
    await dbConnect();
    console.log("✅ Database connected");
    
    // Test: Find and update a test user
    const testEmail = "test@example.com";
    let user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log("📝 Creating test user...");
      user = new User({
        username: "Test User",
        email: testEmail,
        password: "temp123",
        mobile: "1234567890"
      });
      await user.save();
      console.log("✅ Test user created");
    }
    
    // Update the user
    const newUsername = "Updated " + Date.now();
    user.username = newUsername;
    await user.save();
    
    console.log("✅ User updated with username:", newUsername);
    
    // Verify the update
    const verifyUser = await User.findOne({ email: testEmail });
    
    return NextResponse.json({
      success: true,
      test: {
        connection: "OK",
        update: verifyUser.username === newUsername ? "OK" : "FAILED",
        original: user.username,
        updated: verifyUser.username,
        match: verifyUser.username === newUsername
      }
    });
    
  } catch (error) {
    console.error("❌ Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}