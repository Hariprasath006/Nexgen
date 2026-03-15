import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

function HomePage({ cart, setCart, addToCart, updateCartQuantity, wishlist = [], toggleWishlist }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Filtering & Sorting
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    fetchFoods();
  }, []);

  // Update states based on URL changing
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");
    
    if (searchParam !== null) setSearch(searchParam);
    if (categoryParam !== null) setCategory(categoryParam);
  }, [location.search]);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("https://nexgen-yg2a.onrender.com/api/foods");
      let dbFoods = [];
      if (res.data && res.data.success) {
        dbFoods = res.data.data;
      } else {
        dbFoods = res.data || [];
      }
      // Map backend uploaded images safely
      const mappedDbFoods = dbFoods.map(food => {
        let newImage = food.image;
        if (Array.isArray(newImage) && newImage[0] && typeof newImage[0] === 'string' && newImage[0].startsWith('uploads/')) {
           newImage = [`http://localhost:5000/${newImage[0]}`];
        } else if (typeof newImage === 'string' && newImage.startsWith('uploads/')) {
           newImage = `http://localhost:5000/${newImage}`;
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

  // Filter Logic
  let filteredFoods = foods.filter((food) => {
    const searchLow = search.toLowerCase();
    const foodNameLow = food.name ? food.name.toLowerCase() : "";
    const foodCatLow = food.category ? food.category.toLowerCase() : "";
    const matchesSearch = foodNameLow.includes(searchLow) || foodCatLow.includes(searchLow);
    
    const matchesCategory = category === "All" || food.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort Logic
  if (sortOrder === "lowToHigh") {
    filteredFoods.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
  } else if (sortOrder === "highToLow") {
    filteredFoods.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
  }


  return (
    <div className="homepage-wrapper">
      <Navbar cartCount={cart.length} />
      <HeroBanner />

      <main className="main-content container">
        <Categories selectedCategory={category} setSelectedCategory={setCategory} />

        <div className="filter-sort-bar">
          {/* Removed duplicate on-page Live Search Input - Now uses Navbar only */}

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
          <h2 id="products">Products {category !== "All" && `- ${category}`}</h2>
          <span className="result-count">{filteredFoods.length} Results</span>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : filteredFoods.length === 0 ? (
          <div className="no-products-found">
            <h3>No products found for "{search}"</h3>
            <p>Try clearing your search or filters to see more results.</p>
            <button className="btn-secondary" onClick={() => { setSearch(""); setCategory("All"); navigate("/products"); }}>Clear Filters</button>
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
