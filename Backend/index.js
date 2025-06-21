import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

// dotenv configuration to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); // allow us to parse incoming payloads with json body : req.body
app.use(cookieParser()); // allow us to parse cookies from the request headers

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at ${PORT}`);
});
