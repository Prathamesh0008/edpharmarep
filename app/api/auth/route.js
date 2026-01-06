// app/api/auth/route.js - FIXED
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function GET(req) {
  try {
    console.log("🔐 Auth endpoint called");
    
    // Try to get token from cookie first
    const cookieStore = cookies(); // Fixed: get cookie store first
    let token = cookieStore.get("auth")?.value; // Then get the cookie
    console.log("🔐 Token from cookie:", token ? "Yes" : "No");
    
    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization');
      console.log("🔐 Authorization header:", authHeader);
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log("🔐 Using token from header");
      }
    }
    
    if (!token) {
      console.log("🔐 No token found");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔐 Token length:", token.length);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Token decoded successfully for user:", decoded.email);

    await dbConnect();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        mobile: user.mobile || "",
        gender: user.gender || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        pincode: user.address?.pincode || "",
      },
    });
  } catch (err) {
    console.error("🔐 Auth error:", err.message);
    return NextResponse.json(
      { success: false, message: "Session expired" },
      { status: 401 }
    );
  }
}

// In your app/api/auth/route.js - PUT endpoint
export async function PUT(req) {
  try {
    console.log("🔐 Update endpoint called");
    
    // Get token from Authorization header first
    const authHeader = req.headers.get('authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log("🔐 Using token from header");
    } else {
      // Try cookies as fallback
      try {
        const cookieStore = await cookies();
        token = cookieStore.get("auth")?.value;
        console.log("🔐 Using token from cookie:", token ? "Yes" : "No");
      } catch (cookieError) {
        console.log("🔐 Cookie error:", cookieError.message);
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Token decoded for user ID:", decoded.id);
    
    const body = await req.json();
    console.log("🔐 Update request body:", body);
    
    const {
      username,
      street,
      city,
      pincode,
      mobile,
      gender,
    } = body;

    console.log("🔐 Connecting to database...");
    await dbConnect();
    console.log("🔐 Database connected");

    console.log("🔐 Updating user with data:", {
      username,
      mobile,
      gender,
      address: { street, city, pincode }
    });

    // First, find the current user to see what's in DB
    const currentUser = await User.findById(decoded.id);
    console.log("🔐 Current user in DB before update:", {
      username: currentUser?.username,
      email: currentUser?.email,
      mobile: currentUser?.mobile,
      gender: currentUser?.gender,
      address: currentUser?.address
    });

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        username,
        mobile,
        gender,
        address: { street, city, pincode },
      },
      { 
        new: true,
        runValidators: true // Ensure validation runs
      }
    ).select("-password");

    console.log("🔐 Updated user result:", updatedUser);

    if (!updatedUser) {
      console.log("🔐 User not found after update attempt");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Verify the update actually happened by fetching again
    const verifyUser = await User.findById(decoded.id).select("-password");
    console.log("🔐 Verification fetch:", {
      username: verifyUser.username,
      mobile: verifyUser.mobile,
      gender: verifyUser.gender,
      address: verifyUser.address
    });

    return NextResponse.json({
      success: true,
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile || "",
        gender: updatedUser.gender || "",
        street: updatedUser.address?.street || "",
        city: updatedUser.address?.city || "",
        pincode: updatedUser.address?.pincode || "",
      },
      debug: {
        updateApplied: verifyUser.username === username,
        addressMatch: JSON.stringify(verifyUser.address) === JSON.stringify({ street, city, pincode })
      }
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    console.error("❌ Error stack:", err.stack);
    
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      console.error("❌ Validation errors:", err.errors);
      return NextResponse.json(
        { success: false, message: "Validation error: " + err.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
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
    
//     // Try to get token from cookie first
//     let token = cookies().get("auth")?.value;
//     console.log("🔐 Token from cookie:", token ? "Yes" : "No");
    
//     // If no cookie, try Authorization header
//     if (!token) {
//       const authHeader = req.headers.get('authorization');
//       console.log("🔐 Authorization header:", authHeader);
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.substring(7);
//         console.log("🔐 Using token from header");
//       }
//     }
    
//     if (!token) {
//       console.log("🔐 No token found");
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     console.log("🔐 Token length:", token.length);
    
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

// // PUT endpoint remains same but add header support too
// export async function PUT(req) {
//   try {
//     console.log("🔐 Update endpoint called");
    
//     // Try to get token from cookie first
//     let token = cookies().get("auth")?.value;
    
//     // If no cookie, try Authorization header
//     if (!token) {
//       const authHeader = req.headers.get('authorization');
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.substring(7);
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