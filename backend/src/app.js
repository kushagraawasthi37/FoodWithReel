const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g. https://yourfrontend.com
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1); // if behind proxy (like on Render)

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Your route imports and usage here
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/food", require("./routes/food.routes"));
app.use("/api/food-partner", require("./routes/food-partner.routes"));

app.get("/", (req, res) => {
  res.send("Hii");
});

module.exports = app;
