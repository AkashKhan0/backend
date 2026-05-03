import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE ================= */
export const createProduct = async (req, res) => {
  try {
    const { name, title, description, category } = req.body;

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const upload = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        uploadedImages.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
    }

    const product = await Product.create({
      name,
      title,
      description,
      category,
      images: uploadedImages,
    });

    res.json(product);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed ❌" });
  }
};

/* ================= GET ALL ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Fetch failed ❌" });
  }
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found ❌" });
    }

    // delete images from cloudinary
    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();

    res.json({ message: "Deleted ✅" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed ❌" });
  }
};

/* ================= UPDATE ================= */
export const updateProduct = async (req, res) => {
  try {
    const { name, title, description, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found ❌" });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // delete old images
      for (let img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // upload new images
      for (let file of req.files) {
        const upload = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        newImages.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
    }

    // update fields
    product.name = name;
    product.title = title;
    product.description = description;
    product.category = category;

    // only update images if new uploaded
    if (newImages.length > 0) {
      product.images = newImages;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed ❌" });
  }
};