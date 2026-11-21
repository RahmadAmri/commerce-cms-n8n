import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/commerce_cms", {
  dialect: "postgres",
  logging: false,
});
