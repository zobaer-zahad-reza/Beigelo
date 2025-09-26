import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15d' // Token will expire in 15 days
    });
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error("Login User Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const payload = { id: "admin_user_id", role: "admin" };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { loginUser, registerUser, adminLogin, getProfile };