// /pages/api/admin/orders.js
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Admin logic
    res.status(200).json({ orders: [] });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}