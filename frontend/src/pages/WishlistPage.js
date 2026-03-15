import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";

function WishlistPage({ cart, addToCart, updateCartQuantity, wishlist, toggleWishlist }) {
  const navigate = useNavigate();

  return (
    <div className="homepage-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
      
      <main className="main-content container" style={{ flex: 1, padding: '40px 15px' }}>
        <div className="section-header" style={{ marginBottom: '30px' }}>
          <h2>My Wishlist</h2>
          <span className="result-count">{wishlist.length} Items</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="no-products-found" style={{ textAlign: 'center', padding: '50px 0' }}>
            <h3 style={{ marginBottom: '15px' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px' }}>
              Looks like you haven't added anything to your wishlist yet.
            </p>
            <button className="btn-primary" onClick={() => navigate("/products")}>
              Explore Products
            </button>
          </div>
        ) : (
          <div className="food-grid">
            {wishlist.map((food) => (
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

export default WishlistPage;
