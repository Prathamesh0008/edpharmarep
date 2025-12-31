// ---------------- ORDERS ----------------
export const ORDERS = [
  {
    id: "EDP-1001",
    patient: "Rushikesh Andhale",
    product: "Monthly Tablet Plan",
    status: "Pending Doctor Review",
    amount: "₹10,999",
  },
  {
    id: "EDP-1002",
    patient: "Neha Joshi",
    product: "Injection Program",
    status: "Approved",
    amount: "₹8,999",
  },
  {
    id: "EDP-1003",
    patient: "Ayaan Shaikh",
    product: "Starter Tablet Plan",
    status: "Shipped",
    amount: "₹5,999",
  },
  {
    id: "EDP-1004",
    patient: "Rohit Patil",
    product: "Tablet Program",
    status: "Cancelled",
    amount: "₹3,499",
  },
];

// ---------------- PRODUCTS ----------------
export const PRODUCTS = [
  {
    id: "PRD-SEM-3",
    name: "Semaglutide 3mg",
    sku: "SEM-3",
    price: "₹1,999",
    stock: 120,
    status: "Approved",
  },
  {
    id: "PRD-MNJ-5",
    name: "Mounjaro Injection 5mg",
    sku: "MNJ-5",
    price: "₹9,999",
    stock: 30,
    status: "Approved",
  },
  {
    id: "PRD-VIT-D",
    name: "Vitamin D3 60K",
    sku: "VD3-60",
    price: "₹199",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PRD-NEW-1",
    name: "New Product Draft",
    sku: "NEW-1",
    price: "₹499",
    stock: 50,
    status: "Pending Approval",
  },
];

// ---------------- USERS ----------------
export const USERS = [
  {
    id: "USR-001",
    name: "Ayaan Shaikh",
    email: "ayaan@mail.com",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Rohit Patil",
    email: "rohit@mail.com",
    status: "Blocked",
  },
];