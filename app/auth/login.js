// /pages/api/auth/login.js
import jwt from "jsonwebtoken";

// Mock users DB
const users = [
  { id: 1, email: "admin@example.com", password: "admin123", role: "admin" },
  { id: 2, email: "user@example.com", password: "user123", role: "user" },
];

export default async function handler(req, res) {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set HTTP-only cookie
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
  res.status(200).json({ user });
}