const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

// Generate JWT Route
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

/* ===========================
   REGISTER USER
=========================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          cart: newUser.cart || [],
          wishlist: newUser.wishlist || [],
          token: generateToken(newUser.id),
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   LOGIN USER
=========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        message: "Login successful",
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          cart: user.cart || [],
          wishlist: user.wishlist || [],
          token: generateToken(user.id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   GET MY PROFILE (Protected)
=========================== */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   SYNC CART (Protected)
=========================== */
router.put("/sync-cart", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Sanitize the cart to remove _id if it's not a valid 24-character hex string (e.g. dummy products)
    const sanitizedCart = (req.body.cart || []).map(item => {
      const { _id, ...rest } = item;
      return /^[0-9a-fA-F]{24}$/.test(_id) ? item : rest;
    });

    user.cart = sanitizedCart;
    await user.save();
    
    res.json({ success: true, message: "Cart synced successfully", data: user.cart });
  } catch (error) {
    console.error("Cart Sync Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   SYNC WISHLIST (Protected)
=========================== */
router.put("/sync-wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Sanitize the wishlist to remove _id if it's not a valid 24-character hex string
    const sanitizedWishlist = (req.body.wishlist || []).map(item => {
      const { _id, ...rest } = item;
      return /^[0-9a-fA-F]{24}$/.test(_id) ? item : rest;
    });

    user.wishlist = sanitizedWishlist;
    await user.save();
    
    res.json({ success: true, message: "Wishlist synced successfully", data: user.wishlist });
  } catch (error) {
    console.error("Wishlist Sync Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;