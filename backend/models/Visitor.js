import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String,

  source: String, // facebook, google, direct
  medium: String, // cpc, social
  campaign: String, // eid_sale, sale2026

  page: String, // /product/iphone-15
  userAgent: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Visitor", visitorSchema);
