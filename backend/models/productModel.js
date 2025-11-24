import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },

  offerPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  watchGrade: { type: String, default: "Original" },

  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
