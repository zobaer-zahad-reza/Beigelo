import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import nodemailer from "nodemailer";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// CORS Setup
const allowedOrigins = [
  // Live Domains
  "https://beigelo.com",
  "https://www.beigelo.com",
  "https://iamadmin.beigelo.com",
  "https://api.beigelo.com",

  "http://localhost:5174", // Your React development server
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request's Origin: ", origin);
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent
  })
);

// Database & Cloudinary
connectDB();
connectCloudinary();

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// API Route for sending email
app.post("/api/send-email-contactpage", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FOR_USER_CONTACT,
      pass: process.env.EMAIL_PASS_FOR_USER_CONTACT,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_FOR_USER_CONTACT,
    subject: "New Message from Beigelo Contact Form",
    html: `
        <h3>You have a new message from your website!</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
    console.log("Email sent: " + info.response);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  });
});

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.listen(port, () => console.log("🚀 Server Started on PORT : " + port));
