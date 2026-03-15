import React from "react";
import { useNavigate } from "react-router-dom";
import { categories as localCategories } from "../assets/assets";

function Categories({ selectedCategory, setSelectedCategory }) {
  const navigate = useNavigate();

  const allCategory = {
    text: "All",
    path: "All",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050147.png"
  };

  const categories = [allCategory, ...localCategories];

  return (
    <div className="categories-section">
      <h2 className="category-title">Shop by Category</h2>
      <div className="category-scroll-container">
        {categories.map((cat, index) => (
          <div
            className={`category-item ${selectedCategory === cat.path ? 'active' : ''}`}
            key={index}
            onClick={() => {
              if (setSelectedCategory) {
                setSelectedCategory(cat.path);
              } else {
                navigate(`/products?category=${cat.path}`);
              }
              setTimeout(() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          >
            <div className="category-img-wrapper">
              <img src={cat.image} alt={cat.text} loading="lazy" />
            </div>
            <p className="category-name">{cat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;