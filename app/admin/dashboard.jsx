"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role"); // assume you save role on login
    setUser({ role });
  }, []);

  if (!user) return <p>Loading...</p>;
  if (user.role !== "admin") return <p>Access Denied</p>;

  return <div>Welcome to Admin Dashboard</div>;
}