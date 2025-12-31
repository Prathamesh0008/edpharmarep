"use client";

import { useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { USERS } from "../../data/adminDemo";

export default function UsersPage() {
  const [users] = useState(USERS);

  const columns = [
    { key: "name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "status", label: "STATUS" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <DataTable columns={columns} rows={users} />
    </div>
  );
}