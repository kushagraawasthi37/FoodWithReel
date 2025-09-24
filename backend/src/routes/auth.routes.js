// auth.routes.js
const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// User Auth
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post(
  "/user/logout",
  authMiddleware.authUserMiddleware,
  authController.logoutUser
);

// Food Partner Auth
router.post(
  "/food-partner/register",
  upload.single("avatar"),
  authController.registerFoodPartner
);
router.post("/food-partner/login", authController.loginFoodPartner);
router.post(
  "/food-partner/logout",
  authMiddleware.authFoodpartnerMiddleware,
  authController.logoutFoodPartner
);

// Current logged-in user
router.get(
  "/me",
  authMiddleware.authUserMiddleware,
  authController.getCurrentUser
);

module.exports = router;
