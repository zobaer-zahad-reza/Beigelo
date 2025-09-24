import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// CORS Setup
const allowedOrigins = [
// Live Domains
  'https://beigelo.com',
  'https://www.beigelo.com',
  'https://iamadmin.beigelo.com',
  'https://api.beigelo.com',
  
  'http://localhost:5174',       // Your React development server
  'http://localhost:5173',
];

// 2. CONFIGURE AND USE THE CORS MIDDLEWARE
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

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.listen(port, () => console.log("🚀 Server Started on PORT : " + port));
