require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* ============================= */
/* DATABASE CONNECTION */
/* ============================= */

connectDB();

/* ============================= */
/* MIDDLEWARE */
/* ============================= */

app.use(cors());
app.use(express.json());

/* ============================= */
/* STATIC FILES (UPLOADS) */
/* ============================= */

app.use("/uploads", express.static("uploads"));

/* ============================= */
/* TEST ROUTE */
/* ============================= */

app.get("/", (req, res) => {
  res.send("Amazon Snacks Backend Running 🚀");
});

/* ============================= */
/* API ROUTES */
/* ============================= */

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

/* ============================= */
/* ERROR HANDLING */
/* ============================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ============================= */
/* SERVER */
/* ============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});