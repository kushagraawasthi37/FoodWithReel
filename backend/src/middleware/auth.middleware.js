const foodPartnerModel = require("../models/foodpartner.models");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

async function authFoodpartnerMiddleware(req, res, next) {
  // Check token in cookie or Authorization header
  const authHeader = req.header("Authorization");
  const token =
    req.cookies?.token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1].trim()
      : null);

  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const foodPartner = await foodPartnerModel.findById(decodedToken._id);

  if (!foodPartner) {
    return res.status(403).json({ message: "Unauthorized request please login first" });
  }

  req.foodPartner = foodPartner;
  next();
}


async function authUserMiddleware(req, res, next) {
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

    const user = await userModel.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "Login first required" });
    }

    req.user = user;
    console.log("User linked successfully:", req.user);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Login again." });
  }
}

module.exports = {
  authFoodpartnerMiddleware,
  authUserMiddleware,
};
