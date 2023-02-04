import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { register } from "./controller/auth.js";
import { createPost } from "./controller/post.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import connectDB from "./database/connection.js";
import { verifyToken } from "./middleware/auth.js";

// MIDDLEWARE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(morgan("common"));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
});
const upload = multer({ storage });

// routes with file upload
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", upload.single("picture"), verifyToken, createPost);

// routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// connect database
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
