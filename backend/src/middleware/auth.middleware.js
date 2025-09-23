const foodPartnerModel = require("../models/foodpartner.models");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

// Middleware for food partner
async function authFoodpartnerMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const foodPartner = await foodPartnerModel
    .findById(decodedToken._id)
    .select("-password");
  if (!foodPartner) {
    return res
      .status(403)
      .json({ message: "Unauthorized request — food partner not found" });
  }

  req.foodPartner = foodPartner;
  next();
}

// Middleware for normal user
async function authUserMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized request — token missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await userModel.findById(decodedToken._id).select("-password");
  if (!user) {
    return res.status(401).json({ message: "Login required" });
  }

  req.user = user;
  next();
}

module.exports = {
  authFoodpartnerMiddleware,
  authUserMiddleware,
};
