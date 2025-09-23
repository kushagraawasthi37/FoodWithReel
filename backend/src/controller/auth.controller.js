const userModel = require("../models/user.models");
const foodPartnerModel = require("../models/foodpartner.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

// Helper function to generate JWT
function generateToken(id) {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
}

// ------------------- USER -------------------

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  if (await userModel.findOne({ email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    message: "User created successfully",
    user: { _id: user._id, email: user.email, fullName: user.fullName },
    token,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ message: "Email and password cannot be empty" });
  }

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(403).json({ message: "Invalid password" });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "User login successful",
    user: { _id: user._id, email: user.email, fullName: user.fullName },
    token,
  });
}

// ------------------- FOOD PARTNER -------------------

async function registerFoodPartner(req, res) {
  const { fullName, email, password, Address, contactName, phone } = req.body;
  const localAvatarFile = req.file;

  if (await foodPartnerModel.findOne({ email })) {
    return res
      .status(400)
      .json({ message: "Food partner account already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let uploadedAvatar;
  if (localAvatarFile) {
    uploadedAvatar = await storageService.uploadFile(
      localAvatarFile.buffer,
      uuid() + localAvatarFile.originalname
    );
  }

  const foodPartner = await foodPartnerModel.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    Address,
    contactName,
    avatar: uploadedAvatar
      ? uploadedAvatar.url
      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000",
  });

  const token = generateToken(foodPartner._id);

  res.status(201).json({
    message: "Food partner created successfully",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      fullName: foodPartner.fullName,
      contactName: foodPartner.contactName,
      Address: foodPartner.Address,
      phone: foodPartner.phone,
    },
    token,
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ message: "Email and password cannot be empty" });
  }

  const foodPartner = await foodPartnerModel.findOne({ email });
  if (!foodPartner)
    return res.status(404).json({ message: "Partner not found" });

  if (!(await bcrypt.compare(password, foodPartner.password))) {
    return res.status(403).json({ message: "Invalid password" });
  }

  const token = generateToken(foodPartner._id);

  res.status(200).json({
    message: "Partner login successful",
    user: {
      _id: foodPartner._id,
      fullName: foodPartner.fullName,
      contactName: foodPartner.contactName,
      phone: foodPartner.phone,
      Address: foodPartner.Address,
      isFoodPartner: true,
    },
    token,
  });
}

// ------------------- LOGOUT -------------------
// Optional: with Bearer token, logout is frontend-only (just delete token client-side)
async function logoutUser(req, res) {
  res
    .status(200)
    .json({ message: "Logout successful — remove token on client" });
}

async function logoutFoodPartner(req, res) {
  res
    .status(200)
    .json({ message: "Logout successful — remove token on client" });
}

// ------------------- GET CURRENT USER -------------------

async function getCurrentUser(req, res) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel
      .findById(decoded._id)
      .select("-password");
    if (foodPartner) {
      return res
        .status(200)
        .json({ user: { ...foodPartner.toObject(), isFoodPartner: true } });
    }

    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) return res.status(401).json({ message: "Not logged in" });

    return res
      .status(200)
      .json({ user: { ...user.toObject(), isFoodPartner: false } });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getCurrentUser,
};
