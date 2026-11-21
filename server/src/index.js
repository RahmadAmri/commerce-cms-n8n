import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import { sequelize } from "./database.js";
import { Product, Order } from "./models.js";
import { createTripayTransaction, verifyTripayCallback } from "./tripay.js";

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ];
    callback(null, allowed.includes(origin));
  },
}));
app.use(express.json({
  limit: "1mb",
  verify: (req, _res, buffer) => {
    req.rawBody = buffer.toString("utf8");
  },
}));

let dbReady = false;
const demoProducts = [
  { id: 1, name: "Essential Overshirt", slug: "essential-overshirt", description: "Overshirt relaxed fit dari katun premium.", price: 489000, stock: 24, category: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", active: true },
  { id: 2, name: "Daily Linen Shirt", slug: "daily-linen-shirt", description: "Kemeja linen ringan untuk tampilan sehari-hari.", price: 359000, stock: 18, category: "Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85", active: true },
  { id: 3, name: "Urban Carryall", slug: "urban-carryall", description: "Tas carryall minimalis dengan kompartemen laptop.", price: 649000, stock: 12, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", active: true },
  { id: 4, name: "Classic Nylon Watch", slug: "classic-nylon-watch", description: "Jam tangan kasual dengan tali nilon tahan lama.", price: 799000, stock: 9, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", active: true },
];
const demoOrders = [];

async function triggerN8n(event, payload) {
  if (!process.env.N8N_WEBHOOK_URL) return;
  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, { event, payload }, {
      headers: process.env.N8N_WEBHOOK_TOKEN ? { "X-Webhook-Token": process.env.N8N_WEBHOOK_TOKEN } : {},
      timeout: 5000,
    });
  } catch (error) {
    console.warn("n8n webhook failed:", error.message);
  }
}

app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok", database: dbReady ? "connected" : "demo-mode", tripay: process.env.TRIPAY_API_KEY ? "configured" : "mock" });
});

app.get("/api/products", async (_req, res) => {
  if (!dbReady) return res.json(demoProducts.filter((item) => item.active));
  const products = await Product.findAll({ where: { active: true }, order: [["id", "ASC"]] });
  res.json(products);
});

app.post("/api/admin/products", async (req, res) => {
  const { name, description = "", price, stock = 0, category = "Umum", image = "" } = req.body;
  if (!name || !Number.isFinite(Number(price))) return res.status(400).json({ message: "Nama dan harga wajib diisi" });
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!dbReady) {
    const product = { id: demoProducts.length + 1, name, slug, description, price: Number(price), stock: Number(stock), category, image, active: true };
    demoProducts.push(product);
    await triggerN8n("product.created", product);
    return res.status(201).json(product);
  }
  const product = await Product.create({ name, slug, description, price: Number(price), stock: Number(stock), category, image });
  await triggerN8n("product.created", product.toJSON());
  res.status(201).json(product);
});

app.put("/api/admin/products/:id", async (req, res) => {
  if (!dbReady) {
    const index = demoProducts.findIndex((item) => item.id === Number(req.params.id));
    if (index < 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    demoProducts[index] = { ...demoProducts[index], ...req.body };
    return res.json(demoProducts[index]);
  }
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
  await product.update(req.body);
  res.json(product);
});

app.delete("/api/admin/products/:id", async (req, res) => {
  if (!dbReady) {
    const index = demoProducts.findIndex((item) => item.id === Number(req.params.id));
    if (index < 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    demoProducts.splice(index, 1);
    return res.status(204).send();
  }
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
  await product.destroy();
  res.status(204).send();
});

app.get("/api/admin/orders", async (_req, res) => {
  const orders = dbReady ? await Order.findAll({ order: [["id", "DESC"]] }) : demoOrders;
  res.json(orders);
});

app.post("/api/orders", async (req, res) => {
  const { customerName, customerEmail, customerPhone, items } = req.body;
  if (!customerName || !customerEmail || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "Data pelanggan dan item wajib diisi" });
  }
  const amount = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const reference = `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const payload = { reference, customerName, customerEmail, customerPhone: customerPhone || "-", items, amount };

  try {
    if (!dbReady) {
      const transaction = await createTripayTransaction(payload);
      const order = { id: demoOrders.length + 1, ...payload, status: "UNPAID", paymentMethod: "Tripay", checkoutUrl: transaction.checkout_url };
      demoOrders.unshift(order);
      await triggerN8n("order.created", order);
      return res.status(201).json(order);
    }
    const order = await Order.create(payload);
    const transaction = await createTripayTransaction(payload);
    await order.update({ reference: transaction.reference || reference, checkoutUrl: transaction.checkout_url, status: transaction.status || "UNPAID" });
    await triggerN8n("order.created", order.toJSON());
    res.status(201).json(order);
  } catch (error) {
    res.status(502).json({ message: "Gagal membuat pembayaran", detail: error.message });
  }
});

app.get("/api/payments/mock/:reference", (req, res) => {
  res.send(`<!doctype html><html><body style="font-family:sans-serif;padding:40px"><h2>Sandbox Tripay Demo</h2><p>Referensi: ${req.params.reference}</p><form method="post" action="/api/payments/mock/${req.params.reference}/pay"><button>Bayar Sekarang</button></form></body></html>`);
});

app.post("/api/payments/mock/:reference/pay", async (req, res) => {
  if (dbReady) {
    const order = await Order.findOne({ where: { reference: req.params.reference } });
    if (order) await order.update({ status: "PAID" });
  } else {
    const order = demoOrders.find((item) => item.reference === req.params.reference);
    if (order) order.status = "PAID";
  }
  await triggerN8n("payment.paid", { reference: req.params.reference });
  res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/orders?paid=${req.params.reference}`);
});

app.post("/api/payments/tripay/callback", async (req, res) => {
  const receivedSignature = req.header("X-Callback-Signature") || req.header("x-callback-signature");
  if (!verifyTripayCallback(req.body, receivedSignature, req.rawBody)) return res.status(401).json({ message: "Invalid callback signature" });
  const paid = req.body.status === "PAID";
  if (dbReady) {
    const order = await Order.findOne({ where: { reference: req.body.merchant_ref } });
    if (order) await order.update({ status: req.body.status });
  } else {
    const order = demoOrders.find((item) => item.reference === req.body.merchant_ref);
    if (order) order.status = req.body.status;
  }
  if (paid) await triggerN8n("payment.paid", req.body);
  res.json({ success: true });
});

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  dbReady = true;
  console.log("PostgreSQL connected");
} catch (error) {
  console.warn(`Database unavailable, starting in demo mode: ${error.message}`);
}

app.listen(port, () => console.log(`Commerce API listening on http://localhost:${port}`));
