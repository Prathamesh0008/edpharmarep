import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/app/models/User"; // ✅ CORRECT PATH
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        username:
          user.username ||
          user.name ||
          user.fullName ||
          user.email.split("@")[0],
        email: user.email,
        role: user.role || "user",
      },
    });

    response.cookies.set({
      name: "auth",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",                // 🔥 REQUIRED
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}






// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/db";
// import User from "@/app/models/User";
// import jwt from "jsonwebtoken";
// import { serialize } from "cookie";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();
//     await dbConnect();

//     // 🔐 NORMAL USER LOGIN
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ✅ CREATE JWT
//     const token = jwt.sign(
//       {
//         id: user._id.toString(),
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // ✅ SET COOKIE (THIS WAS MISSING)
//     const response = NextResponse.json({
//       success: true,
//       user: {
//         email: user.email,
//         role: user.role,
//       },
//     });

//     response.headers.set(
//       "Set-Cookie",
//       serialize("auth", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",        // 🔥 MOST IMPORTANT
//         maxAge: 60 * 60 * 24 * 7, // 7 days
//       })
//     );

//     return response;
//   } catch (err) {
//     console.error("LOGIN_ERROR:", err);
//     return NextResponse.json(
//       { success: false, message: "Server error" },
//       { status: 500 }
//     );
//   }
// }




// // import { NextResponse } from "next/server";
// // import bcrypt from "bcryptjs";
// // import dbConnect from "@/lib/db";
// // import User from "@/app/models/User";


// // export async function POST(req) {
// //   const { email, password } = await req.json();
// //   await dbConnect();

// //   // 🔥 ADMIN LOGIN
// //   if (
// //     email === process.env.ADMIN_EMAIL &&
// //     password === process.env.ADMIN_PASSWORD
// //   ) {
// //     return NextResponse.json({
// //       success: true,
// //       user: {
// //         email,
// //         role: "admin",
// //       },
// //     });
// //   }

// //   // 🔒 NORMAL USER
// //   const user = await User.findOne({ email });
// //   if (!user) {
// //     return NextResponse.json({ success: false }, { status: 401 });
// //   }

// //   const match = await bcrypt.compare(password, user.password);
// //   if (!match) {
// //     return NextResponse.json({ success: false }, { status: 401 });
// //   }

// //   return NextResponse.json({
// //     success: true,
// //     user: {
// //       email: user.email,
// //       role: user.role,
// //     },
// //   });
// // }




// // // import dbConnect from "@/lib/db";
// // // import User from "../../../models/User";
// // // import bcrypt from "bcryptjs";
// // // import { NextResponse } from "next/server";

// // // export async function POST(request) {
// // //   try {
// // //     await dbConnect();

// // //     const { email, password } = await request.json();

// // //     const user = await User.findOne({ email });
// // //     if (!user) {
// // //       return NextResponse.json(
// // //         { success: false, message: "User not found" },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     const ok = await bcrypt.compare(password, user.password);
// // //     if (!ok) {
// // //       return NextResponse.json(
// // //         { success: false, message: "Invalid credentials" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     return NextResponse.json({
// // //   success: true,
// // //   user: {
// // //     _id: user._id.toString(), // ✅ Mongo ID
// // //     username: user.username,
// // //     email: user.email,
// // //   },
// // // });


// // //   } catch (err) {
// // //     return NextResponse.json(
// // //       { success: false, message: err.message },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }
