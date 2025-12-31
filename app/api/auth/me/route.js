import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const token = cookies().get("auth")?.value;
    if (!token) {
      return Response.json({ ok: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return Response.json({
      ok: true,
      user: {
        id: payload.id,
        email: payload.email,
      },
    });
  } catch {
    return Response.json({ ok: false }, { status: 401 });
  }
}
