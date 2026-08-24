const Food = require("./models/Food");
const connectDB = require("./config/db");

const seedFoods = async () => {
  try {
    await connectDB();

    await Food.deleteMany({});

    await Food.insertMany([
      // Snacks
      {
        name: "Puffs",
        price: 15,
        category: "snacks",
        image: ["uploads/1773374959878-bakery_image.png"]
      },
      {
        name: "Samosa",
        price: 12,
        category: "snacks",
        image: ["uploads/samosa_image.png"]
      },
      {
        name: "Bread Omelette",
        price: 25,
        category: "snacks",
        image: ["uploads/bread_omelette_image.png"]
      },
      {
        name: "Veg Sandwich",
        price: 30,
        category: "snacks",
        image: ["uploads/veg_sandwich_image.png"]
      },
      {
        name: "Pani Puri",
        price: 25,
        category: "snacks",
        image: ["uploads/pani_puri_image.png"]
      },

      // Biscuits
      {
        name: "Oreo",
        price: 10,
        category: "biscuits",
        image: ["uploads/oreo_image.png"]
      },
      {
        name: "Dark Fantasy",
        price: 30,
        category: "biscuits",
        image: ["uploads/dark_fantasy_image.png"]
      },
      {
        name: "Marie Gold",
        price: 10,
        category: "biscuits",
        image: ["uploads/marie_gold_image.png"]
      },

      // Chips
      {
        name: "Lays",
        price: 20,
        category: "chips",
        image: ["uploads/lays_image.png"]
      },
      {
        name: "Kurkure",
        price: 20,
        category: "chips",
        image: ["uploads/kurkure_image.png"]
      },

      // Food
      {
        name: "Chicken Rice",
        price: 80,
        category: "food",
        image: ["uploads/chicken_rice_image.png"]
      },
      {
        name: "Briyani",
        price: 100,
        category: "food",
        image: ["uploads/briyani_image.png"]
      },
      {
        name: "Dosa",
        price: 40,
        category: "food",
        image: ["uploads/dosa_image.png"]
      },
      {
        name: "Parotta",
        price: 35,
        category: "food",
        image: ["uploads/parotta_image.png"]
      },
      {
        name: "Noodles",
        price: 60,
        category: "food",
        image: ["uploads/noodles_image.png"]
      },

      // Drinks
      {
        name: "Tea",
        price: 10,
        category: "drinks",
        image: ["uploads/tea_image.png"]
      },
      {
        name: "Coffee",
        price: 15,
        category: "drinks",
        image: ["uploads/coffee_image.png"]
      }
    ]);

    console.log("Foods inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedFoods();
