import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    category: {
      type: String,
      enum: ["medical", "surgical"],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
