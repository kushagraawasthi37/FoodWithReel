const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();
app.set("trust proxy", 1); // <-- Add this

// CORS for frontend domains
app.use(
  cors({
    origin: [
      "https://foodwithreel-frontend.onrender.com", // deployed frontend
      "http://localhost:5173", // local dev
    ],
    credentials: true,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

// Serve React static files in production


// Health check
app.get("/health", (req, res) => res.send("Server is running!"));

module.exports = app;
