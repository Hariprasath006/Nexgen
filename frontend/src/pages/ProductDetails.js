import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiHeart, FiStar, FiPlus, FiMinus, FiArrowLeft, FiTruck, FiShield } from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProductDetails({ cart, setCart, addToCart, updateCartQuantity, wishlist = [], toggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const isWishlisted = product ? wishlist.some(item => item._id === product._id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`https://nexgen-yg2a.onrender.com/api/foods/${id}`);
      let dbProduct = res.data?.data || res.data;
      
      if (!dbProduct) {
        toast.error("Product not found!");
        navigate("/products");
        return;
      }
      
      // Map backend uploaded images safely
      let newImage = dbProduct.image;
      if (Array.isArray(newImage) && newImage[0] && typeof newImage[0] === 'string' && newImage[0].startsWith('uploads/')) {
         newImage = [`http://localhost:5000/${newImage[0]}`];
      } else if (typeof newImage === 'string' && newImage.startsWith('uploads/')) {
         newImage = [`http://localhost:5000/${newImage}`];
      }
      const finalProduct = { ...dbProduct, image: Array.isArray(newImage) ? newImage : [newImage] };
      
      setProduct(finalProduct);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details.");
      navigate("/");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <Navbar cartCount={cart.length} />
        <div className="loading-container"><div className="spinner"></div></div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const cartItem = cart.find(item => item._id === product._id);
  const originalPrice = product.price || 0;
  const offerPrice = product.offerPrice || originalPrice;
  const discountPercent = originalPrice > offerPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const rating = product.rating || 4.5;
  const numReviews = product.numReviews || 342;
  
  // Deterministic mock stock count so it stays consistent across renders
  const idHash = product._id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const stockCount = Math.abs(idHash) % 100 + 5;

  return (
    <div className="homepage-wrapper">
      <Navbar cartCount={cart.length} />
      
      <main className="main-content container" style={{ padding: '30px 15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', cursor: 'pointer', fontSize: '15px' }}>
          <FiArrowLeft size={18} /> Back to products
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', background: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          
          {/* Left: Images */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  style={{ width: '60px', height: '60px', border: activeImage === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '5px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <img src={img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {discountPercent > 0 && <span className="discount-badge" style={{ top: '15px', left: '15px' }}>{discountPercent}% OFF</span>}
              <div className="wishlist-icon" onClick={() => { if(toggleWishlist) toggleWishlist(product); }} style={{ top: '15px', right: '15px' }}>
                <FiHeart size={24} color={isWishlisted ? "var(--secondary)" : "var(--text-light)"} fill={isWishlisted ? "var(--secondary)" : "none"} />
              </div>
              <img src={images[activeImage]} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                   <FiStar key={star} size={16} color={star <= Math.round(rating) ? "var(--secondary)" : "#ccc"} fill={star <= Math.round(rating) ? "var(--secondary)" : "none"} />
                ))}
              </div>
              <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>{numReviews} Ratings</span>
            </div>

            <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '5px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-dark)' }}>₹{offerPrice}</span>
                {discountPercent > 0 && <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '16px' }}>M.R.P: ₹{originalPrice}</span>}
              </div>
              <p style={{ color: stockCount > 5 ? '#059669' : '#ea580c', fontWeight: '600', fontSize: '14px', marginBottom: '15px' }}>
                {stockCount > 5 ? `In Stock (${stockCount} available)` : `Hurry! Only ${stockCount} left in stock.`}
              </p>

              {cartItem ? (
                <div className="qty-controls" style={{ width: '150px', padding: '8px' }}>
                  <button className="qty-btn" onClick={() => updateCartQuantity(product._id, -1)} disabled={cartItem.qty <= 1}><FiMinus size={18} /></button>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{cartItem.qty}</span>
                  <button className="qty-btn" onClick={() => updateCartQuantity(product._id, 1)}><FiPlus size={18} /></button>
                </div>
              ) : (
                <button className="btn-primary" onClick={() => addToCart(product)} style={{ width: '200px', padding: '15px', fontSize: '16px' }}>
                  Add to Cart
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-body)' }}>
                <FiTruck size={20} color="var(--primary-light)" />
                <span style={{ fontSize: '14px' }}>Free delivery on orders over ₹500</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-body)' }}>
                <FiShield size={20} color="var(--primary-light)" />
                <span style={{ fontSize: '14px' }}>Genuine product guarantee</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Product Description</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-body)', lineHeight: '1.8' }}>
                {product.description && Array.isArray(product.description) 
                  ? product.description.map((desc, i) => <li key={i}>{desc}</li>)
                  : <li>{product.description || "Fresh and high quality product sourced carefully for you."}</li>
                }
                <li>Category: <strong>{product.category}</strong></li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
