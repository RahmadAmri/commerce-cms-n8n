import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  price: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  image: { type: DataTypes.STRING, defaultValue: "" },
  category: { type: DataTypes.STRING, defaultValue: "Umum" },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING, allowNull: false, unique: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  items: { type: DataTypes.JSONB, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "UNPAID" },
  paymentMethod: { type: DataTypes.STRING, defaultValue: "Tripay" },
  checkoutUrl: { type: DataTypes.TEXT, defaultValue: "" },
});
