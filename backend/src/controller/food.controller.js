const commentModel = require("../models/comment.models");
const foodModel = require("../models/food.models");
const FoodPartner = require("../models/foodpartner.models"); // your food-partner model
const likeModel = require("../models/likes.models");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid"); //Unique file name

async function createFood(req, res) {
  console.log(req.foodPartner);
  console.log(req.body);
  console.log(req.file);

  const localFoodVideo = req.file;
  const { name, description } = req.body;

  if (!localFoodVideo || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const fileUploadResult = await storageService.uploadFile(
    localFoodVideo.buffer,
    uuid() + localFoodVideo.originalname
  );

  console.log(fileUploadResult);
  /* 
  fileId:68d10e415c7cd75eb8f95d25,
  filePath: '/6ed5b703-f938-4933-bfca-5d17a7ef63333196344-hd_1280_720_25fps_bHfqMiRPv.mp4',
  url: 'https://ik.imagekit.io/Kushagra76/6ed5b703-f938-4933-bfca-5d17a7ef63333196344-hd_1280_720_25fps_bHfqMiRPv.mp4',
  height: 720,
  width: 1280,
  bitRate: 1908149,
  duration: 14,
  videoCodec: 'h264',
  */

  if (!fileUploadResult.url) {
    return res.status(500).json({ message: "File upload failed " });
  }

  const foodItem = await foodModel.create({
    name,
    description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "Food created successfully",
    food: foodItem,
  });
}

async function getAllFoodItems(req, res) {
  const foodItems = await foodModel.find().populate("foodPartner", "fullName"); //populate se foodpartner ka name aa jayega id nahi ayegi

  return res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

async function likeFood(req, res) {
  const { foodId } = req.body;
  const user = req.user || req.foodPartner;

  if (!foodId) {
    return res.status(400).json({ message: "Food id is required" });
  }

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const existingLike = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (existingLike) {
    await likeModel.findByIdAndDelete(existingLike._id);
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

    const likes = await likeModel.countDocuments({ food: foodId });
    return res.status(200).json({ liked: false, likes });
  }

  await likeModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

  const likes = await likeModel.countDocuments({ food: foodId });
  return res.status(201).json({ liked: true, likes });
}

async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user || req.foodPartner;

  if (!foodId) {
    return res.status(400).json({ message: "Food id is required" });
  }

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const existingSave = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (existingSave) {
    await saveModel.findByIdAndDelete(existingSave._id);
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });

    const saves = await saveModel.countDocuments({ food: foodId });
    return res.status(200).json({ saved: false, saves });
  }

  await saveModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });

  const saves = await saveModel.countDocuments({ food: foodId });
  return res.status(201).json({ saved: true, saves });
}


// GET /api/food/save
const getSavedVideos = async (req, res) => {
  try {
    const userId = req.user?._id || req.foodPartner?._id; // Support both user types

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find all saved entries for this user (could be user or food partner)
    const savedEntries = await saveModel
      .find({ user: userId })
      .populate({
        path: "food",
        populate: { path: "foodPartner", select: "_id name" },
      })
      .lean();

    // Extract food objects from saved entries
    const savedVideos = savedEntries
      .map((entry) => entry.food)
      .filter((food) => food != null);

    return res.status(200).json({ savedVideos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


async function commentFood(req, res) {
  const { foodId, content } = req.body;
  const user = req.user || req.foodPartner; // Support either

  if (!foodId) {
    return res.status(400).json({ message: "Food id is required" });
  }

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await commentModel.create({ content, user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

  const commentCount = await commentModel.countDocuments({ food: foodId });
  return res.status(201).json({ comment: true, commentCount });
}


async function getAllComment(req, res) {
  const { foodId } = req.params; // get foodId from route param

  if (!foodId) {
    return res.status(400).json({ message: "Food id is required" });
  }

  try {
    const totalComments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName avatar"); // optional: include user info

    return res.status(200).json({ success: true, comments: totalComments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Update comment
async function updateComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!content?.trim())
    return res.status(400).json({ message: "Content cannot be empty" });

  try {
    const comment = await commentModel.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.user.equals(user._id))
      return res.status(403).json({ message: "Unauthorized" });

    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Delete comment
async function deleteComment(req, res) {
  const { id } = req.params;
  const user = req.user;

  try {
    const comment = await commentModel.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.user.equals(user._id))
      return res.status(403).json({ message: "Unauthorized" });

    await commentModel.findByIdAndDelete(id);
    await foodModel.findByIdAndUpdate(comment.food, {
      $inc: { commentCount: -1 },
    });

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Get all videos/foods of a specific owner
const getOwnerFoods = async (req, res) => {
  const { ownerId } = req.params;
  console.log("Owner route hit succesfully");
  try {
    // fetch owner info
    const owner = await FoodPartner.findById(ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    // fetch all foods/videos of this owner
    const foods = await foodModel.find({ foodPartner: ownerId });

    res.status(200).json({ foodPartner: owner, foodItems: foods });
  } catch (err) {
    console.error("Error fetching owner videos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFood,
  getAllFoodItems,
  likeFood,
  saveFood,
  commentFood,
  getAllComment,
  updateComment,
  deleteComment,
  getSavedVideos,
  getOwnerFoods,
};
