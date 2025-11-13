import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
    sizes: { type: Array },
    date: { type: Date, default: Date.now },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;