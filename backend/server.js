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
import brandRouter from "./routes/brandRoute.js";
import trackVisitor from "./middleware/trackVisitor.js";
import trackingRoutes from "./routes/trackingRoutes.js";
// NEW IMPORT: Fraud Route
import fraudRouter from "./routes/fraudRoute.js"; 

// App Config
const app = express();
const port = process.env.PORT || 4000;

// CORS Setup 
const allowedOrigins = [
  "https://beigelo.com",
  "https://www.beigelo.com",
  "https://iamadmin.beigelo.com",
  "https://api.beigelo.com",
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:4000",
  "http://beigelo.com",
  "http://www.beigelo.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        console.error("❌ CORS Blocked Request from:", origin);
        return callback(new Error("CORS Policy Error"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Database & Cloudinary
connectDB();
connectCloudinary();

//API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/brand", brandRouter);
app.use("/api/visitors", trackingRoutes);

// Fraud Check api
app.use("/api/fraud", fraudRouter);


// API Route for sending email
app.post("/api/send-email-contactpage", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FOR_USER_CONTACT,
        pass: process.env.EMAIL_PASS_FOR_USER_CONTACT,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_FOR_USER_CONTACT}>`,
      replyTo: email,
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("API Working ✅");
});


app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => console.log("🚀 Server Started on PORT : " + port));