import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const productsFromWordpressDatabase = [
  {
    name: "Teipe Scotch Super 33+",
    description: `Destacado: Aplicación: Bajas tensiones. Color: Negro. Material: Cloruro de polivinilo. Rango de temperatura de operación: 32°F A 220°F. Uso: todo tipo de empalmes. Marca: 3M. La cinta Scotch Super 33+ es una cinta aislante de vinilo fabricada por 3M. Esta cinta es ampliamente utilizada para aplicaciones de aislamiento eléctrico en cables y conexiones de baja tensión. Aislamiento eléctrico: La cinta Scotch Super 33+ ofrece un buen nivel de aislamiento eléctrico, lo que la hace adecuada para proteger cables y conexiones en aplicaciones de baja tensión, como en sistemas eléctricos residenciales, comerciales e industriales. Adhesión duradera: Esta cinta cuenta con un adhesivo sensible a la presión que se adhiere de manera segura y duradera a una amplia variedad de superficies, como plástico, metal y caucho. Resistencia a la humedad y el envejecimiento: La cinta Scotch Super 33+ es resistente a la humedad, lo que la hace adecuada para aplicaciones en entornos húmedos o expuestos a la intemperie. Flexibilidad y conformabilidad: La cinta es flexible y fácil de manejar, lo que permite su aplicación en cables y conexiones de diferentes formas y tamaños. Cumplimiento de estándares: La cinta Scotch Super 33+ cumple con varios estándares de la industria, como UL y CSA.`,
    price: 8,
    category: "Electricidad, Ferretería en General",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005227.png",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: 'Disco de corte Extra fino 3W 7" 1/16 x 7/8 C/R',
    description:
      "This product lacks a detailed description. Please refer to the product name and category for an idea of its use and application.",
    price: 1.2,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005253.png",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Electrodo De Tungsteno 1/8 punta roja WeldTech",
    description:
      "This product lacks a detailed description. Please refer to the product name and category for an idea of its use and application.",
    price: 5.88,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005344.png",
    brand: "WeldTech",
    countInStock: 100,
  },
];
const importProducts = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = await Promise.all(
      productsFromWordpressDatabase.map(async (product) => {
        try {
          return {
            ...product,
            user: adminUser,
          };
        } catch (error) {
          console.error(
            `Error uploading for product ${product.name}: ${error}`
          );
          // Return a default image or modify as needed to ensure required fields are included
          return {
            ...product,
            user: adminUser,
          };
        }
      })
    );

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importProducts();
