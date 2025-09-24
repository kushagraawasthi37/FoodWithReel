// server.js
require("dotenv").config();
const path = require("path");
const app = require("./src/app");
const connectDB = require("./src/db/db");

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
