import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const brandModel =
  mongoose.models.brand || mongoose.model("brand", brandSchema);

export default brandModel;
