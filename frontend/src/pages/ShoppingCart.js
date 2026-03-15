import React from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ShoppingCart({ cart, setCart, removeFromCart, updateCartQuantity }) {
  const navigate = useNavigate();

  // Price calculations
  const subtotal = cart.reduce((sum, item) => {
    const price = item.offerPrice || item.price;
    return sum + price * (item.qty || 1);
  }, 0);
  
  const tax = subtotal * 0.05; // 5% tax
  const delivery = subtotal > 500 ? 0 : 40; // Free delivery over ₹500
  const total = subtotal + tax + delivery;

  const handleCheckout = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login?redirect=/address");
    } else {
      navigate("/address");
    }
  };

  return (
    <>
      <Navbar cartCount={cart.length} />
      <div className="cart-page container">
        
        {cart.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Your Amazon Shopping Cart is empty.</h2>
            <p>Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, snacks, and more.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-left">
              <h2>Shopping Cart</h2>
              <span className="cart-subtitle">Deselect all items</span>
              <p className="price-header">Price</p>
              
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div className="cart-item-row" key={item._id}>
                    <div className="cart-item-image">
                      <img 
                        src={Array.isArray(item.image) ? item.image[0] : item.image} 
                        alt={item.name} 
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h3 className="item-title">{item.name}</h3>
                      <p className="item-stock">In stock</p>
                      <p className="item-shipping">Eligible for FREE Shipping</p>
                      
                      <div className="item-actions">
                        <div className="qty-controls-cart">
                          <button onClick={() => updateCartQuantity(item._id, -1)} disabled={item.qty <= 1}>
                            <FiMinus />
                          </button>
                          <span>{item.qty || 1}</span>
                          <button onClick={() => updateCartQuantity(item._id, 1)}>
                            <FiPlus />
                          </button>
                        </div>
                        <span className="action-divider">|</span>
                        <button className="btn-link" onClick={() => removeFromCart(item._id)}>Delete</button>
                        <span className="action-divider">|</span>
                        <button className="btn-link">Save for later</button>
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      <strong>₹{item.offerPrice || item.price}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-right">
              <div className="checkout-card">
                <p className="free-delivery-msg">
                  {delivery === 0 
                    ? "✓ Your order is eligible for FREE Delivery." 
                    : `Add ₹${500 - subtotal} more for FREE Delivery.`
                  }
                </p>
                
                <h3 className="subtotal-text">
                  Subtotal ({cart.length} items): <strong>₹{subtotal.toFixed(2)}</strong>
                </h3>
                
                <div className="price-breakdown">
                  <div className="flex-between"><span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex-between"><span>Tax (5%):</span> <span>₹{tax.toFixed(2)}</span></div>
                  <div className="flex-between"><span>Delivery:</span> <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                  <hr />
                  <div className="flex-between total-row"><span>Total:</span> <span>₹{total.toFixed(2)}</span></div>
                </div>

                <div className="gift-checkbox">
                  <input type="checkbox" id="gift" />
                  <label htmlFor="gift">This order contains a gift</label>
                </div>

                <button className="btn-checkout" onClick={handleCheckout}>
                  Proceed to Buy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ShoppingCart;