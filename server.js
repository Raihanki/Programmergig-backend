import express from "express";
import dotenv, { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticated } from "./middleware/authenticated.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

// route import
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import gigRoutes from "./routes/gig.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
app.use(express.json());
config(dotenv);
config(cors(corsOptions));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/users", authenticated, userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.listen(process.env.APP_PORT, () => {
  mongooseConnect();
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
