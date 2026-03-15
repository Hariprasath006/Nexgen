const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* Ensure uploads directory exists */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* MULTER STORAGE */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ===========================
   GET ALL FOODS
=========================== */
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   ADD FOOD
=========================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const newFood = new Food({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      offerPrice: req.body.offerPrice,
      image: ["http://localhost:5000/uploads/" + req.file.filename],
      stock: req.body.stock || 50
    });

    await newFood.save();
    res.status(201).json({ success: true, message: "Food added", data: newFood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   UPDATE FOOD (EDIT)
=========================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    const updatedData = {
      name: req.body.name || food.name,
      price: req.body.price || food.price,
      offerPrice: req.body.offerPrice || food.offerPrice,
      category: req.body.category || food.category,
      description: req.body.description || food.description,
      stock: req.body.stock !== undefined ? req.body.stock : food.stock
    };

    if (req.file) {
      updatedData.image = ["http://localhost:5000/uploads/" + req.file.filename];
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ success: true, message: "Food updated", data: updatedFood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   DELETE FOOD
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* GET SINGLE FOOD */
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;