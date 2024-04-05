import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Category from "./models/categoriesModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const categories = [
  "abrasivos",
  "construcción",
  "consumibles",
  "electricidad",
  "ferretería en general",
  "herramientas agrícolas",
  "herramientas eléctricas",
  "herramientas manuales",
  "hogar y accesorios",
  "iluminación",
  "plomería",
  "seguridad industrial",
  "soldadura y oxicorte",
  "todos los productos",
  "tuberías",
];

const seedCategories = async () => {
  try {
    const createdCategories = await Category.insertMany(
      categories.map((category) => ({ name: category }))
    );

    console.log("Categories imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

seedCategories();
