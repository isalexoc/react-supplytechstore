import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Product from "./models/productModel.js";
import connectDB from "./config/db.js";
import fs from "fs/promises"; // Use the Promise-based version of fs

dotenv.config();

connectDB();

const saveProductsToFile = async () => {
  try {
    const products = await Product.find({});
    // Use pretty JSON formatting and async file write
    await fs.writeFile(
      "productsfromdb.json",
      JSON.stringify(products, null, 2)
    );
    console.log("Data Saved!".green.inverse);
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1); // Exit with failure
  } finally {
    // Disconnect from DB in finally block to ensure it always runs
    await mongoose.disconnect();
    process.exit(); // Exit successfully
  }
};

saveProductsToFile();
