import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,      

  source: String,     
  medium: String,    
  campaign: String,   

  page: String,   
  userAgent: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Visitor", visitorSchema);