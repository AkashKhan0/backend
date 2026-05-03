import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

export default app;