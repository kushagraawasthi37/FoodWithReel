const foodPartnerModel = require("../models/foodpartner.models");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

async function authAnyUserMiddleware(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1].trim()
        : null);

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

    // Check if food partner
    const foodPartner = await foodPartnerModel
      .findById(decodedToken._id)
      .select("-password");
    if (foodPartner) {
      req.foodPartner = foodPartner;
      req.userType = "foodPartner";
      return next();
    }

    // Check if regular user
    const user = await userModel.findById(decodedToken._id).select("-password");
    if (user) {
      req.user = user;
      req.userType = "user";
      return next();
    }

    return res.status(403).json({ message: "Unauthorized user" });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Login again." });
  }
}

function requireFoodPartner(req, res, next) {
  if (req.userType !== "foodPartner") {
    return res.status(403).json({ message: "Forbidden: Food partner access only" });
  }
  next();
}

module.exports = {
  authAnyUserMiddleware,
  requireFoodPartner
};
