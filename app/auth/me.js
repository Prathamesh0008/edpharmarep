// /pages/api/auth/me.js
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ user: null });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user });
  } catch {
    res.status(401).json({ user: null });
  }
}