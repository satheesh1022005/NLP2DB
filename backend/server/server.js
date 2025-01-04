import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js"; // Import the middleware
import { pool } from "./config/db.js";
import deployRoutes from "./routes/deployRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dotenv from "dotenv";
dotenv.config();
// Initialize Express app
const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies and other credentials
  })
);
app.use(express.json());

app.use("/api", deployRoutes);
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
