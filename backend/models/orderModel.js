import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: String 
    },
    
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }, 
    paymentMethod: { type: String, required: true }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;