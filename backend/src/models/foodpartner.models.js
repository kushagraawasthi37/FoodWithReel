const mongoose = require("mongoose");

const foodpartnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  contactName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  Address: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
  },
});

const foodPartnerModel = mongoose.model("foodpartner", foodpartnerSchema);
module.exports = foodPartnerModel;
