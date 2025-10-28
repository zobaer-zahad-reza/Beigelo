import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        const userId = req.userId ? req.userId : undefined;

        const newOrder = new orderModel({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: "COD",
            payment: true, 
            date: new Date(Date.now())
        });
        await newOrder.save();

        if (userId) {
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
        }

        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.log("COD Order Error:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const { origin } = req.headers;
        const userId = req.userId ? req.userId : undefined;

        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: "Stripe",
            payment: false,
            date: new Date(Date.now())
        });
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: 'Delivery Charges' },
                unit_amount: 80 * 100 
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            metadata: {
                orderId: newOrder._id.toString()
            }
        });
        
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Stripe Session Error:", error);
        res.status(500).json({ success: false, message: "Error creating Stripe session" });
    }
};

const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body; 
    
    try {
        if (success === "true") {
            const order = await orderModel.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Paid" });
            
            if (order.userId) {
                await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
            }
            
            res.json({ success: true, message: "Payment Successful, Order Updated" });

        } else {

            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed or Cancelled, Order Removed" });
        }
    } catch (error) {
        console.log("Stripe Verification Error:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};


const placeOrderRazorpay = async (req, res) => {
    res.json({ success: false, message: "Razorpay is not yet implemented." });
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("Fetch User Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("Fetch All Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching all orders" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay,
    verifyStripe, 
    userOrders, 
    allOrders, 
    updateStatus 
};