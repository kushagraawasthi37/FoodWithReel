const express = require("express");
const router = express.Router();
const foodPartnerControllers = require("../controller/food-partner.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  foodPartnerControllers.getFoodPartnerProfileById
);

module.exports = router;
