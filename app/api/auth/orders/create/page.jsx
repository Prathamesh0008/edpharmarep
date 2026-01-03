"use client";

import { useEffect, useState } from "react";
import DataTable from "@/app/components/admin/DataTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  /* ================= NORMALIZE ================= */
  function normalizeStatus(status) {
    if (!status) return "Order Placed";

    const s = status.toLowerCase();
    if (s.includes("order")) return "Order Placed";
    if (s.includes("pending")) return "Pending Review";
    if (s.includes("approved")) return "Approved";
    if (s.includes("rejected")) return "Rejected";
    return "Order Placed";
  }

  /* ================= STATUS STYLING ================= */
  const getStatusStyle = (status) => {
    const baseStyle = "rounded-full px-3 py-1 text-xs font-medium";
    
    switch(status) {
      case "Rejected":
        return `${baseStyle} bg-red-50 text-red-700 border border-red-200`;
      case "Approved":
        return `${baseStyle} bg-green-50 text-green-700 border border-green-200`;
      case "Pending Review":
        return `${baseStyle} bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case "Order Placed":
        return `${baseStyle} bg-blue-50 text-blue-700 border border-blue-200`;
      default:
        return `${baseStyle} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) =>
        setOrders(
          data.map((o) => ({
            ...o,
            status: normalizeStatus(o.status),
          }))
        )
      );
  }, []);

  /* ================= UPDATE ================= */
  const handleStatusChange = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const columns = [
    { key: "id", label: "ORDER ID" },
    { key: "patient", label: "PATIENT" },
    { key: "product", label: "PRODUCT" },
    { key: "status", label: "STATUS" },
    { key: "amount", label: "AMOUNT" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = (key, row) => {
    /* ===== STATUS DROPDOWN ===== */
    if (key === "status") {
      return (
        <select
          value={row.status}
          onChange={(e) =>
            handleStatusChange(row.id, e.target.value)
          }
          className={`
            relative z-30
            rounded-xl border border-slate-200
            px-3 py-1.5 text-sm bg-white
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-slate-200
            ${row.status === "Rejected" ? "text-red-600" : ""}
          `}
        >
          <option value="Order Placed">Order Placed</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected" className="text-red-600">Rejected</option>
        </select>
      );
    }

    /* ===== DELETE ===== */
    if (key === "actions") {
      return (
        <button
          onClick={() => handleDelete(row.id)}
          className="
            px-3 py-1.5 rounded-xl
            border border-rose-200
            text-rose-600 text-sm
            hover:bg-rose-50
          "
        >
          Delete
        </button>
      );
    }

    return row[key];
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Orders</h1>

      <DataTable
        columns={columns}
        rows={orders}
        renderCell={renderCell}
        mobileCardTitle={(row) => `Order #${row.id}`}
        mobileCardLines={(row) => [
          { label: "Patient", value: row.patient },
          { label: "Product", value: row.product },
          {
            label: "Status",
            value: (
              <select
                value={row.status}
                onChange={(e) =>
                  handleStatusChange(row.id, e.target.value)
                }
                className={`
                  w-full rounded-xl border border-slate-200
                  px-3 py-1.5 text-sm bg-white
                  ${row.status === "Rejected" ? "text-red-600" : ""}
                `}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected" className="text-red-600">Rejected</option>
              </select>
            ),
          },
        ]}
      />
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import DataTable from "@/app/components/admin/DataTable";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);

//   /* ================= NORMALIZE ================= */
//   function normalizeStatus(status) {
//     if (!status) return "Order Placed";

//     const s = status.toLowerCase();
//     if (s.includes("order")) return "Order Placed";
//     if (s.includes("pending")) return "Pending Review";
//     if (s.includes("approved")) return "Approved";
//     if (s.includes("rejected")) return "Rejected";
//     return "Order Placed";
//   }

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     fetch("/api/orders")
//       .then((res) => res.json())
//       .then((data) =>
//         setOrders(
//           data.map((o) => ({
//             ...o,
//             status: normalizeStatus(o.status),
//           }))
//         )
//       );
//   }, []);

//   /* ================= UPDATE ================= */
//   const handleStatusChange = (id, status) => {
//     setOrders((prev) =>
//       prev.map((o) =>
//         o.id === id ? { ...o, status } : o
//       )
//     );
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = (id) => {
//     setOrders((prev) => prev.filter((o) => o.id !== id));
//   };

//   const columns = [
//     { key: "id", label: "ORDER ID" },
//     { key: "patient", label: "PATIENT" },
//     { key: "product", label: "PRODUCT" },
//     { key: "status", label: "STATUS" },
//     { key: "amount", label: "AMOUNT" },
//     { key: "actions", label: "ACTIONS" },
//   ];

//   const renderCell = (key, row) => {
//     /* ===== STATUS DROPDOWN ===== */
//     if (key === "status") {
//       return (
//         <select
//           value={row.status}
//           onChange={(e) =>
//             handleStatusChange(row.id, e.target.value)
//           }
//           className="
//             relative z-30                 /* ✅ REQUIRED */
//             rounded-xl border border-slate-200
//             px-3 py-1.5 text-sm bg-white
//             cursor-pointer
//             focus:outline-none focus:ring-2 focus:ring-slate-200
//           "
//         >
//           <option value="Order Placed">Order Placed</option>
//           <option value="Pending Review">Pending Review</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
//         </select>
//       );
//     }

//     /* ===== DELETE ===== */
//     if (key === "actions") {
//       return (
//         <button
//           onClick={() => handleDelete(row.id)}
//           className="
//             px-3 py-1.5 rounded-xl
//             border border-rose-200
//             text-rose-600 text-sm
//             hover:bg-rose-50
//           "
//         >
//           Delete
//         </button>
//       );
//     }

//     return row[key];
//   };

//   return (
//     <div className="space-y-5">
//       <h1 className="text-xl font-semibold">Orders</h1>

//       <DataTable
//         columns={columns}
//         rows={orders}
//         renderCell={renderCell}
//         mobileCardTitle={(row) => `Order #${row.id}`}
//         mobileCardLines={(row) => [
//           { label: "Patient", value: row.patient },
//           { label: "Product", value: row.product },
//           {
//             label: "Status",
//             value: (
//               <select
//                 value={row.status}
//                 onChange={(e) =>
//                   handleStatusChange(row.id, e.target.value)
//                 }
//                 className="
//                   w-full rounded-xl border border-slate-200
//                   px-3 py-1.5 text-sm bg-white
//                 "
//               >
//                 <option value="Order Placed">Order Placed</option>
//                 <option value="Pending Review">Pending Review</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             ),
//           },
//         ]}
//       />
//     </div>
//   );
// }