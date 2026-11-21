import { sequelize } from "./database.js";
import { Product, Order } from "./models.js";

await sequelize.authenticate();
await sequelize.sync({ alter: true });

const count = await Product.count();
if (count === 0) {
  await Product.bulkCreate([
    { name: "Essential Overshirt", slug: "essential-overshirt", description: "Overshirt relaxed fit dari katun premium.", price: 489000, stock: 24, category: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85" },
    { name: "Daily Linen Shirt", slug: "daily-linen-shirt", description: "Kemeja linen ringan untuk tampilan sehari-hari.", price: 359000, stock: 18, category: "Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85" },
    { name: "Urban Carryall", slug: "urban-carryall", description: "Tas carryall minimalis dengan kompartemen laptop.", price: 649000, stock: 12, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" },
    { name: "Classic Nylon Watch", slug: "classic-nylon-watch", description: "Jam tangan kasual dengan tali nilon tahan lama.", price: 799000, stock: 9, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
  ]);
}

console.log("Database migrated and seeded.");
await sequelize.close();
