import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email & Password required" }),
      { status: 400 }
    );
  }

  // 🔐 Check fixed admin credentials
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return new Response(
      JSON.stringify({ message: "Invalid admin credentials" }),
      { status: 401 }
    );
  }

  // ✅ Create token
  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=86400`,
      },
    }
  );
}