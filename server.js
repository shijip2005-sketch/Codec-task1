import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bizora_db",
  password: "shijipost",
  port: 5432,
});

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Bizora backend + PostgreSQL connected!"
  });
});

// Customers
app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch customers"
    });
  }
});

// Orders
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        orders.id,
        customers.name AS customer,
        orders.order_date,
        orders.amount,
        orders.status
      FROM orders
      JOIN customers
      ON orders.customer_id = customers.id
      ORDER BY orders.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch orders"
    });
  }
});

// Sales
app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM sales
      ORDER BY sale_date
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch sales"
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Bizora server running on http://localhost:${PORT}`);
});