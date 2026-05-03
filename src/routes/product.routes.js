import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.array("images"), updateProduct);

export default router;