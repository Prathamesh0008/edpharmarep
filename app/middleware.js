import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};



// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const token = req.cookies.get("adminToken")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== "admin") {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };