// food.routes.js
const express = require("express");
const router = express.Router();
const foodControllers = require("../controller/food.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Create food (protected — only food partners)
router.post(
  "/",
  authMiddleware.authAnyUserMiddleware,authMiddleware.requireFoodPartner,
  upload.single("video"),
  foodControllers.createFood
);

// Get all food items (accessible by all users)
router.get(
  "/foodItems",
  // authMiddleware.authUserMiddleware,
  foodControllers.getAllFoodItems
);

// Like / Save food (user protected)
router.post(
  "/like",
  authMiddleware.authAnyUserMiddleware,
  foodControllers.likeFood
);

router.post(
  "/save",
  authMiddleware.authAnyUserMiddleware,
  foodControllers.saveFood
);
router.get(
  "/save",
  authMiddleware.authAnyUserMiddleware,
  foodControllers.getSavedVideos
);

// Comments
router.get(
  "/:foodId/comments",
  // authMiddleware.authAnyUserMiddleware,
  foodControllers.getAllComment
);

router.post(
  "/comment",
  authMiddleware.authAnyUserMiddleware,
  foodControllers.commentFood
);

router.put(
  "/comment/:id",
  authMiddleware.authAnyUserMiddleware,
  foodControllers.updateComment
);
router.delete(
  "/comment/:id",
  authMiddleware.authUserMiddleware,
  foodControllers.deleteComment
);

// Owner foods
router.get(
  "/owner-food/:ownerId",
  // authMiddleware.authAnyUserMiddleware,
  foodControllers.getOwnerFoods
);

module.exports = router;
