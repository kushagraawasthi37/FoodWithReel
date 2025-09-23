// food-partner.routes.js
const express = require("express");
const router = express.Router();
const foodPartnerControllers = require("../controller/food-partner.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get food partner profile by ID (protected)
router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  foodPartnerControllers.getFoodPartnerProfileById
);

module.exports = router;
