import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://medicaladmin-ashen.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

/* ================= ERROR HANDLING ================= */
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥", err);
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
