const express = require("express");
const router = express.Router();
const foodControllers = require("../controller/food.controller");
const authMiddleware = require("../middleware/auth.middleware");

const multer = require("multer");

//Cloud storage provider file ko store karenge aur jab tumhari marji hogi tab tumko file dikha denge
const upload = multer({
  storage: multer.memoryStorage(),
});

//food item add kevel food partner hi add akr skte hai mean ye  protected route hai
router.post(
  "/",
  authMiddleware.authFoodpartnerMiddleware,
  upload.single("video"), //frontend and this name must be same
  foodControllers.createFood
);

//Get all food items - protetected route only logged in user can see the food items

router.get("/foodItems", foodControllers.getAllFoodItems);

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

router.get("/:foodId/comments", foodControllers.getAllComment);

router.post(
  "/comment",
  authMiddleware.authUserMiddleware,
  foodControllers.commentFood
);

// Update a comment
router.put(
  "/comment/:id",
  authMiddleware.authUserMiddleware,
  foodControllers.updateComment
);

// Delete a comment
router.delete(
  "/comment/:id",
  authMiddleware.authUserMiddleware,
  foodControllers.deleteComment
);
router.get("/owner-food/:ownerId", foodControllers.getOwnerFoods);

module.exports = router;
