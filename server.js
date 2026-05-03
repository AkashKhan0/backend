import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

connectDB();

import cors from "cors";

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

console.log("Cloud:", process.env.CLOUD_NAME);
console.log("Key:", process.env.CLOUD_API_KEY);
console.log("Secret:", process.env.CLOUD_API_SECRET);