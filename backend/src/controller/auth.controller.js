const userModel = require("../models/user.models");
const foodPartnerModel = require("../models/foodpartner.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid"); //Unique file name

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already Exist" });
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none", // allow cross-site
    secure: true, // must be true for HTTPS
  });

  res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      message: "Email and password cannot be empty",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    // distinct message
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(403).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none", // allow cross-site
    secure: true, // must be true for HTTPS
  });

  return res.status(200).json({
    message: "User login successfully",
    user: { _id: user._id, email: user.email, fullName: user.fullName },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "user Logged out successfully",
  });
}

async function registerFoodPartner(req, res) {
  const { fullName, email, password, Address, contactName, phone } = req.body;

  const localAvatarFile = req.file;

  const isFoodPartnerAlreadyExist = await foodPartnerModel.findOne({
    email,
  });

  if (isFoodPartnerAlreadyExist) {
    return res
      .status(400)
      .json({ message: "Food partner account already Exist" });
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let uploadedAvatar;
  if (localAvatarFile) {
    uploadedAvatar = await storageService.uploadFile(
      localAvatarFile.buffer,
      uuid() + localAvatarFile.originalname
    );
  }

  const foodpartner = await foodPartnerModel.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    Address,
    contactName,
    avatar: uploadedAvatar
      ? uploadedAvatar.url
      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
  });

  const token = jwt.sign(
    {
      _id: foodpartner._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none", // allow cross-site
    secure: true, // must be true for HTTPS
  });

  res.status(201).json({
    message: "User created successfully",
    foodpartner: {
      _id: foodpartner._id,
      email: foodpartner.email,
      fullName: foodpartner.fullName,
      contactName: foodpartner.contactName,
      Address: foodpartner.Address,
      phone: foodpartner.phone,
    },
  });
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Email and password cannot be empty" });
    }

    const foodpartner = await foodPartnerModel.findOne({ email });

    if (!foodpartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foodpartner.password
    );
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ _id: foodpartner._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // allow cross-site
      secure: true, // must be true for HTTPS
    });
    
    // Return user data and mark as food-partner
    res.status(200).json({
      message: "Partner login successfully",
      user: {
        _id: foodpartner._id,
        fullName: foodpartner.fullName,
        contactName: foodpartner.contactName,
        phone: foodpartner.phone,
        Address: foodpartner.Address,
        isFoodPartner: true, // important for front-end
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "user Logged out successfully",
  });
}

// Get current logged-in user
async function getCurrentUser(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token belongs to food-partner
    const foodPartner = await foodPartnerModel
      .findById(decoded._id)
      .select("-password");

    if (foodPartner) {
      return res
        .status(200)
        .json({ user: { ...foodPartner.toObject(), isFoodPartner: true } });
    }

    // Else check normal user
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
  loginFoodPartner,
  registerFoodPartner,
  logoutFoodPartner,
  getCurrentUser,
};
