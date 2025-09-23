const foodPartnerModel = require("../models/foodpartner.models");
const foodModel = require("../models/food.models");

async function getFoodPartnerProfileById(req, res) {
  const foodPartnerId = req.params.id;
  console.log("Requested ID:", foodPartnerId); // Add this line

  const foodPartner = await foodPartnerModel
    .findById(foodPartnerId)
    .select("-password");

  if (!foodPartner) {
    console.log("Food partner not found in DB!"); // Add this line
    return res.status(404).json({ message: "Food partner not found" });
  }

  const foodItems = await foodModel.find({ foodPartner: foodPartnerId });
  return res.status(200).json({
    message: "Food partner profile fetched successfully",
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems,
    },
  });
}

module.exports = { getFoodPartnerProfileById };
