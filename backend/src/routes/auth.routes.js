const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

//user auth APIs
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get(
  "/user/logout",
  authMiddleware.authUserMiddleware,
  authController.logoutUser
);

//food partner auth APIs
router.post(
  "/food-partner/register",
  upload.single("avatar"),
  authController.registerFoodPartner
);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout",authMiddleware.authFoodpartnerMiddleware, authController.logoutFoodPartner);


//Get currentuser
router.get("/me", authController.getCurrentUser);

module.exports = router;
