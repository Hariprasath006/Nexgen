const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  cart: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      price: Number,
      offerPrice: Number,
      image: mongoose.Schema.Types.Mixed,
      qty: { type: Number, default: 1 }
    }
  ],

  wishlist: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      price: Number,
      offerPrice: Number,
      image: mongoose.Schema.Types.Mixed
    }
  ]

});

module.exports = mongoose.model("User", userSchema);