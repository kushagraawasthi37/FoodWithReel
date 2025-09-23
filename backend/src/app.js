// src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

// CORS configuration
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

// Serve React static files in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/build");
  app.use(express.static(frontendPath));

  // Catch-all for React routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Health check
app.get("/health", (req, res) => res.send("Server is running!"));

module.exports = app;
