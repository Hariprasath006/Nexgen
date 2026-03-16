import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

/* 🔹 Backend API base URL */
const API_URL = "https://nexgen-yg2a.onrender.com";

function HomePage({ cart, setCart, addToCart, updateCartQuantity, wishlist = [], toggleWishlist }) {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  /* 🔹 Fetch products */
  useEffect(() => {
    fetchFoods();
  }, []);

  /* 🔹 Sync search params with URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");

    if (searchParam !== null) setSearch(searchParam);
    if (categoryParam !== null) setCategory(categoryParam);

  }, [location.search]);

  const fetchFoods = async () => {
    try {

      const res = await axios.get(`${API_URL}/api/foods`);

      let dbFoods = [];

      if (res.data && res.data.success) {
        dbFoods = res.data.data;
      } else {
        dbFoods = res.data || [];
      }

      /* 🔹 Fix backend image paths */
      const mappedDbFoods = dbFoods.map(food => {

        let newImage = food.image;

        if (
          Array.isArray(newImage) &&
          newImage[0] &&
          typeof newImage[0] === "string" &&
          newImage[0].startsWith("uploads/")
        ) {
          newImage = [`${API_URL}/${newImage[0]}`];

        } else if (
          typeof newImage === "string" &&
          newImage.startsWith("uploads/")
        ) {
          newImage = `${API_URL}/${newImage}`;
        }

        return { ...food, image: newImage };
      });

      setFoods(mappedDbFoods);
      setLoading(false);

    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to backend server");
      setFoods([]);
      setLoading(false);
    }
  };

  /* 🔹 Filter products */
  let filteredFoods = foods.filter((food) => {

    const searchLow = search.toLowerCase();

    const foodNameLow = food.name ? food.name.toLowerCase() : "";
    const foodCatLow = food.category ? food.category.toLowerCase() : "";

    const matchesSearch =
      foodNameLow.includes(searchLow) ||
      foodCatLow.includes(searchLow);

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  /* 🔹 Sorting */
  if (sortOrder === "lowToHigh") {
    filteredFoods.sort((a, b) =>
      (a.offerPrice || a.price) - (b.offerPrice || b.price)
    );
  }

  else if (sortOrder === "highToLow") {
    filteredFoods.sort((a, b) =>
      (b.offerPrice || b.price) - (a.offerPrice || a.price)
    );
  }

  return (
    <div className="homepage-wrapper">

      <Navbar cartCount={cart.length} />

      <HeroBanner />

      <main className="main-content container">

        <Categories
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />

        <div className="filter-sort-bar">

          <div className="sort-container">
            <label htmlFor="sort">Sort By: </label>

            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="default">Featured</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>

          </div>
        </div>

        <div className="section-header">
          <h2 id="products">
            Products {category !== "All" && `- ${category}`}
          </h2>

          <span className="result-count">
            {filteredFoods.length} Results
          </span>
        </div>

        {loading ? (

          <div className="loading-container">
            <div className="spinner"></div>
          </div>

        ) : filteredFoods.length === 0 ? (

          <div className="no-products-found">

            <h3>No products found for "{search}"</h3>

            <p>Try clearing your search or filters.</p>

            <button
              className="btn-secondary"
              onClick={() => {
                setSearch("");
                setCategory("All");
                navigate("/products");
              }}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="food-grid">

            {filteredFoods.map(food => (

              <FoodCard
                key={food._id}
                food={food}
                cart={cart}
                addToCart={addToCart}
                updateCartQuantity={updateCartQuantity}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />

            ))}

          </div>

        )}

      </main>

      <Footer />

    </div>
  );
}

export default HomePage;
