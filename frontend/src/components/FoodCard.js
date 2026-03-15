import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiPlus, FiMinus } from "react-icons/fi";

function FoodCard({ food, cart = [], addToCart, updateCartQuantity, wishlist = [], toggleWishlist }) {
  const isWishlisted = wishlist.some(item => item._id === food._id);

  // Safely find images
  const imageUrl = food.image && Array.isArray(food.image) && food.image.length > 0 
    ? food.image[0] 
    : food.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"; 
  // Fallback image

  // Check if item is in cart
  const cartItem = cart.find(item => item._id === food._id);

  // Calculate discount percentage
  const originalPrice = food.price || 0;
  const offerPrice = food.offerPrice || originalPrice;
  
  const discountPercent = originalPrice > offerPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  // Deterministic ratings to prevent random re-renders wiping other cards when one is faved
  const idStr = food._id || "";
  const hash = idStr.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const rating = food.rating || ((Math.abs(hash) % 2) + 3.5); // Fallback to 3.5 - 4.5
  const numReviews = food.numReviews || (Math.abs(hash) % 400 + 20);

  // Deterministic stock to reflect "Out of Stock" correctly
  const stockCount = food.stock !== undefined ? food.stock : (Math.abs(hash) % 100 + 5);
  const isOutOfStock = stockCount <= 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if(toggleWishlist) toggleWishlist(food);
  };

  return (
    <div className="product-card">
      <div className="wishlist-icon" onClick={handleWishlistClick}>
        <FiHeart 
          size={22} 
          color={isWishlisted ? "var(--secondary)" : "var(--text-light)"} 
          fill={isWishlisted ? "var(--secondary)" : "none"} 
        />
      </div>

      {discountPercent > 0 && !isOutOfStock && (
        <div className="discount-badge">
          {discountPercent}% OFF
        </div>
      )}

      {isOutOfStock && (
        <div className="discount-badge" style={{ background: '#B12704' }}>
          OUT OF STOCK
        </div>
      )}

      <Link to={`/product/${food._id}`} className="product-img-wrapper" style={{ cursor: 'pointer' }}>
        <img src={imageUrl} alt={food.name} className="product-img" loading="lazy" />
      </Link>

      <div className="product-info">
        <Link to={`/product/${food._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-title" title={food.name}>{food.name}</h3>
        </Link>
        
        <div className="product-rating">
          <span className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <FiStar 
                key={star} 
                size={14} 
                color={star <= Math.round(rating) ? "var(--secondary)" : "#ccc"} 
                fill={star <= Math.round(rating) ? "var(--secondary)" : "none"}
              />
            ))}
          </span>
          <span className="review-count">{numReviews}</span>
        </div>

        <div className="price-container">
          <span className="offer-price">₹{offerPrice}</span>
          {discountPercent > 0 && (
            <span className="original-price">M.R.P: ₹{originalPrice}</span>
          )}
        </div>

        <div className="product-actions" style={{ opacity: isOutOfStock ? 0.6 : 1 }}>
          {cartItem ? (
            <div className="qty-controls">
              <button 
                className="qty-btn" 
                onClick={() => updateCartQuantity(food._id, -1)}
                disabled={cartItem.qty <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="qty-value">{cartItem.qty}</span>
              <button 
                className="qty-btn" 
                onClick={() => updateCartQuantity(food._id, 1)}
                disabled={isOutOfStock}
              >
                <FiPlus size={16} />
              </button>
            </div>
          ) : (
            <button className="cart-btn" onClick={() => !isOutOfStock && addToCart(food)} disabled={isOutOfStock} style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>
               {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;