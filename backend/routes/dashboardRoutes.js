import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Summary cards
router.get("/metrics", authMiddleware, (req, res) => {
  res.json({
    totalSales: 95000,
    totalOrders: 2180,
    inventoryCount: 540,
    returningCustomers: 320,
    newCustomers: 180,
    pendingOrders: 42,
    deliveredToday: 18
  });
});

// Chart data - 12 months
router.get("/chart", authMiddleware, (req, res) => {
  res.json({
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    sales: [1000, 1500, 1800, 2200, 2600, 3000, 3500, 3300, 3100, 4000, 4500, 4800],
    orders: [85, 120, 140, 160, 200, 250, 270, 260, 240, 300, 320, 350]
  });
});

// Table data - 15 rows
router.get("/table", authMiddleware, (req, res) => {
  res.json([
    { orderId: "ORD101", date: "2024-01-01", product: "Keyboard", category: "Electronics", quantity: 2, amount: 500, customer: "John Doe", status: "Delivered" },
    { orderId: "ORD102", date: "2024-01-05", product: "Mouse", category: "Electronics", quantity: 1, amount: 300, customer: "Amit Sharma", status: "Delivered" },
    { orderId: "ORD103", date: "2024-01-10", product: "Shoes", category: "Fashion", quantity: 1, amount: 700, customer: "Priya Verma", status: "Shipped" },
    { orderId: "ORD104", date: "2024-01-15", product: "T-shirt", category: "Fashion", quantity: 3, amount: 1200, customer: "Karan Singh", status: "Processing" },
    { orderId: "ORD105", date: "2024-01-20", product: "Headphones", category: "Electronics", quantity: 1, amount: 1500, customer: "Rahul Kumar", status: "Delivered" },
    { orderId: "ORD106", date: "2024-02-01", product: "Smart Watch", category: "Electronics", quantity: 1, amount: 2500, customer: "Riya Mehta", status: "Delivered" },
    { orderId: "ORD107", date: "2024-02-03", product: "Bag", category: "Accessories", quantity: 1, amount: 900, customer: "Vishal Chauhan", status: "Cancelled" },
    { orderId: "ORD108", date: "2024-02-06", product: "Hoodie", category: "Fashion", quantity: 2, amount: 1600, customer: "Manoj Yadav", status: "Delivered" },
    { orderId: "ORD109", date: "2024-02-10", product: "Charger", category: "Electronics", quantity: 1, amount: 800, customer: "Sakshi Jain", status: "Delivered" },
    { orderId: "ORD110", date: "2024-02-12", product: "Laptop Stand", category: "Electronics", quantity: 1, amount: 1100, customer: "Raman Sahu", status: "Processing" },
    { orderId: "ORD111", date: "2024-02-14", product: "Sandals", category: "Fashion", quantity: 1, amount: 600, customer: "Simran Kaur", status: "Shipped" },
    { orderId: "ORD112", date: "2024-02-17", product: "Bluetooth Speaker", category: "Electronics", quantity: 1, amount: 1800, customer: "Varun Tyagi", status: "Delivered" },
    { orderId: "ORD113", date: "2024-02-18", product: "Jeans", category: "Fashion", quantity: 2, amount: 2000, customer: "Harshit Arora", status: "Delivered" },
    { orderId: "ORD114", date: "2024-02-19", product: "Power Bank", category: "Electronics", quantity: 1, amount: 1300, customer: "Neha Gupta", status: "Shipped" },
    { orderId: "ORD115", date: "2024-02-20", product: "Cap", category: "Accessories", quantity: 1, amount: 400, customer: "Mohit Saini", status: "Delivered" }
  ]);
});

export default router;
