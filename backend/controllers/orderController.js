import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

// Stripe Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: "COD",
            date: new Date(Date.now())
        });
        await newOrder.save();

        // Clear user's cart after placing order
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

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
            success_url: `${origin}/verify?success=true&orderId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/verify?success=false&orderId={CHECKOUT_SESSION_ID}`,
            metadata: {
                userId: req.userId,
                address: JSON.stringify(address),
                items: JSON.stringify(items),
                amount: String(amount)
            }
        });
        
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Stripe Session Error:", error);
        res.status(500).json({ success: false, message: "Error creating Stripe session" });
    }
};


const placeOrderRazorpay = async (req, res) => {
    res.json({ success: false, message: "Razorpay is not yet implemented." });
};


const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed or Cancelled" });
        }
    } catch (error) {
        console.log("Stripe Verification Error:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
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

// --- Admin Panel Functions ---

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