const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ===========================
UPLOADS FOLDER CHECK
=========================== */
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===========================
MULTER STORAGE
=========================== */
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
FIX IMAGE URL FUNCTION
=========================== */
function fixImageUrl(image) {

if (!image) return image;

if (Array.isArray(image)) {
return image.map((img) => {
if (typeof img === "string") {
return img.replace(
"http://localhost:5000",
"https://nexgen-yg2a.onrender.com"
);
}
return img;
});
}

if (typeof image === "string") {
return image.replace(
"http://localhost:5000",
"https://nexgen-yg2a.onrender.com"
);
}

return image;
}

/* ===========================
GET ALL FOODS
=========================== */
router.get("/", async (req, res) => {
try {

```
const foods = await Food.find().sort({ createdAt: -1 });

const fixedFoods = foods.map((food) => {
  const obj = food.toObject();
  obj.image = fixImageUrl(obj.image);
  return obj;
});

res.json({
  success: true,
  data: fixedFoods
});
```

} catch (error) {

```
console.error("GET FOODS ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});
```

}
});

/* ===========================
ADD FOOD
=========================== */
router.post("/", upload.single("image"), async (req, res) => {
try {

```
if (!req.file) {
  return res.status(400).json({
    success: false,
    message: "Image required"
  });
}

const newFood = new Food({
  name: req.body.name,
  price: req.body.price,
  category: req.body.category,
  description: req.body.description,
  offerPrice: req.body.offerPrice,
  image: ["uploads/" + req.file.filename],
  stock: req.body.stock || 50
});

await newFood.save();

res.status(201).json({
  success: true,
  message: "Food added",
  data: newFood
});
```

} catch (error) {

```
console.error("ADD FOOD ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});
```

}
});

/* ===========================
UPDATE FOOD
=========================== */
router.put("/:id", upload.single("image"), async (req, res) => {
try {

```
const food = await Food.findById(req.params.id);

if (!food) {
  return res.status(404).json({
    success: false,
    message: "Food not found"
  });
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
  updatedData.image = ["uploads/" + req.file.filename];
}

const updatedFood = await Food.findByIdAndUpdate(
  req.params.id,
  updatedData,
  { new: true }
);

res.json({
  success: true,
  message: "Food updated",
  data: updatedFood
});
```

} catch (error) {

```
console.error("UPDATE FOOD ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});
```

}
});

/* ===========================
DELETE FOOD
=========================== */
router.delete("/:id", async (req, res) => {
try {

```
const food = await Food.findById(req.params.id);

if (!food) {
  return res.status(404).json({
    success: false,
    message: "Food not found"
  });
}

await Food.findByIdAndDelete(req.params.id);

res.json({
  success: true,
  message: "Food Deleted"
});
```

} catch (error) {

```
console.error("DELETE FOOD ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});
```

}
});

/* ===========================
GET SINGLE FOOD
=========================== */
router.get("/:id", async (req, res) => {
try {

```
const food = await Food.findById(req.params.id);

if (!food) {
  return res.status(404).json({
    success: false,
    message: "Food not found"
  });
}

const obj = food.toObject();
obj.image = fixImageUrl(obj.image);

res.json({
  success: true,
  data: obj
});
```

} catch (error) {

```
console.error("GET SINGLE FOOD ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});
```

}
});

module.exports = router;
