// //app/api/auth/password/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function PUT(req) {
  try {
    // Get token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Both passwords are required" },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
    
  } catch (error) {
    console.error("❌ Password change error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import dbConnect from "@/lib/db";
// import User from "@/app/models/User";

// export async function GET(req) {
//   try {
//     console.log("🔐 Auth endpoint called");
    
//     // Get token from Authorization header first
//     const authHeader = req.headers.get('authorization');
//     let token;
    
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       token = authHeader.substring(7);
//       console.log("🔐 Using token from header");
//     } else {
//       // Try cookies as fallback
//       try {
//         const cookieStore = await cookies(); // Note: await here!
//         token = cookieStore.get("auth")?.value;
//         console.log("🔐 Using token from cookie:", token ? "Yes" : "No");
//       } catch (cookieError) {
//         console.log("🔐 Cookie error:", cookieError.message);
//       }
//     }
    
//     if (!token) {
//       console.log("🔐 No token found");
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("🔐 Token decoded successfully for user:", decoded.email);

//     await dbConnect();

//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       user: {
//         username: user.username,
//         email: user.email,
//         mobile: user.mobile || "",
//         gender: user.gender || "",
//         street: user.address?.street || "",
//         city: user.address?.city || "",
//         pincode: user.address?.pincode || "",
//       },
//     });
//   } catch (err) {
//     console.error("🔐 Auth error:", err.message);
//     return NextResponse.json(
//       { success: false, message: "Session expired" },
//       { status: 401 }
//     );
//   }
// }

// export async function PUT(req) {
//   try {
//     console.log("🔐 Update endpoint called");
    
//     // Get token from Authorization header first
//     const authHeader = req.headers.get('authorization');
//     let token;
    
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       token = authHeader.substring(7);
//     } else {
//       // Try cookies as fallback
//       try {
//         const cookieStore = await cookies(); // Note: await here!
//         token = cookieStore.get("auth")?.value;
//       } catch (cookieError) {
//         console.log("🔐 Cookie error:", cookieError.message);
//       }
//     }
    
//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const {
//       username,
//       street,
//       city,
//       pincode,
//       mobile,
//       gender,
//     } = await req.json();

//     await dbConnect();

//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.id,
//       {
//         username,
//         mobile,
//         gender,
//         address: { street, city, pincode },
//       },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       user: {
//         username: updatedUser.username,
//         email: updatedUser.email,
//         mobile: updatedUser.mobile || "",
//         gender: updatedUser.gender || "",
//         street: updatedUser.address?.street || "",
//         city: updatedUser.address?.city || "",
//         pincode: updatedUser.address?.pincode || "",
//       },
//     });
//   } catch (err) {
//     console.error("Update error:", err.message);
//     return NextResponse.json(
//       { success: false, message: "Session expired" },
//       { status: 401 }
//     );
//   }
// }