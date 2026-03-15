const Food = require("./models/Food");
const connectDB = require("./config/db");

connectDB();

Food.insertMany([

  { name: "Puffs", price: 15, category: "snacks" },
  { name: "Samosa", price: 12, category: "snacks" },
  { name: "Bread Omelette", price: 25, category: "snacks" },
  { name: "Veg Sandwich", price: 30, category: "snacks" },
  { name: "Pani Puri", price: 25, category: "snacks" },

  { name: "Oreo", price: 10, category: "biscuits" },
  { name: "Dark Fantasy", price: 30, category: "biscuits" },
  { name: "Marie Gold", price: 10, category: "biscuits" },

  { name: "Lays", price: 20, category: "chips" },
  { name: "Kurkure", price: 20, category: "chips" },

  { name: "Chicken Rice", price: 80, category: "food" },
  { name: "Briyani", price: 100, category: "food" },
  { name: "Dosa", price: 40, category: "food" },
  { name: "Parotta", price: 35, category: "food" },
  { name: "Noodles", price: 60, category: "food" },

  { name: "Tea", price: 10, category: "drinks" },
  { name: "Coffee", price: 15, category: "drinks" }

]).then(() => {

  console.log("Foods inserted successfully");
  process.exit();

});