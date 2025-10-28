import userModel from "../models/userModel.js";


const addToCart = async (req, res) => {
    try {
        const userId = req.userId; 
        const { itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        if (!cartData[itemId][size]) {
            cartData[itemId][size] = 1;
        } else {
            cartData[itemId][size] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: "Server error while adding to cart" });
    }
};


const updateCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;
        if (!cartData[itemId] || !cartData[itemId][size]) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        if (quantity > 0) {
            cartData[itemId][size] = quantity;
        } else {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.error("Update Cart Error:", error);
        res.status(500).json({ success: false, message: "Server error while updating cart" });
    }
};


const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error("Get User Cart Error:", error);
        res.status(500).json({ success: false, message: "Server error while fetching cart" });
    }
};

export { addToCart, updateCart, getUserCart };