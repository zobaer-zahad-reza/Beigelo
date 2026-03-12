import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, default: "Unknown" },
    country: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },

    // UTM / traffic source
    source: { type: String, default: "Direct" },
    medium: { type: String, default: "-" },
    campaign: { type: String, default: "-" },

    // Page & browser
    page: { type: String, default: "/" },
    referrer: { type: String, default: "direct" },
    userAgent: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ ip: 1 });

export default mongoose.model("Visitor", visitorSchema);
