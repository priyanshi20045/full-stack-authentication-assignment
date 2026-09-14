import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { connectDatabase } from "./config/database.js";
dotenv.config();
const app = express();

app.use(helmet());

app.use(
  cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
})
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();