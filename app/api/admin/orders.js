import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Your admin logic here (example)
    res.status(200).json({ orders: [{ id: 1, product: "Product 1" }] });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}