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
  authMiddleware.authFoodpartnerMiddleware,
  upload.single("video"),
  foodControllers.createFood
);

// Get all food items (accessible by logged-in users)
router.get(
  "/foodItems",
  authMiddleware.authUserMiddleware,
  foodControllers.getAllFoodItems
);

// Like / Save food (user protected)
router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodControllers.likeFood
);
router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodControllers.saveFood
);
router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  foodControllers.getSavedVideos
);

// Comments
router.get(
  "/:foodId/comments",
  authMiddleware.authUserMiddleware,
  foodControllers.getAllComment
);
router.post(
  "/comment",
  authMiddleware.authUserMiddleware,
  foodControllers.commentFood
);
router.put(
  "/comment/:id",
  authMiddleware.authUserMiddleware,
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
  authMiddleware.authUserMiddleware,
  foodControllers.getOwnerFoods
);

module.exports = router;
