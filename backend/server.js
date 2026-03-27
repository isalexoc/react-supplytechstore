import path from "path";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { startDailyExchangeRateScheduler } from "./jobs/scheduleDailyExchangeRate.js";
import { setSocketIO } from "./socketInstance.js";

if (process.env.NODE_ENV === "production") {
  const required = ["MONGO_URI", "JWT_SECRET"];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
}

//bugs fixed
const port = process.env.PORT || 5000;

connectDB();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Middleware to parse JSON data in the body of the request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // any route that is not an API route, will point to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);

const devSocketOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
const prodSocketOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim())
  : true;

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? prodSocketOrigins : devSocketOrigins,
    methods: ["GET", "POST"],
  },
});

setSocketIO(io);

httpServer.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  startDailyExchangeRateScheduler();
});
