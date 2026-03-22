import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiHeart, FiStar, FiPlus, FiMinus, FiArrowLeft, FiTruck, FiShield } from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "https://nexgen-yg2a.onrender.com";

function ProductDetails({ cart, addToCart, updateCartQuantity, wishlist = [], toggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const isWishlisted = product
    ? wishlist.some(item => item._id === product._id)
    : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/foods/${id}`);
      let dbProduct = res.data?.data || res.data;

      if (!dbProduct) {
        toast.error("Product not found");
        navigate("/products");
        return;
      }

      let newImage = dbProduct.image;

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
        newImage = [`${API_URL}/${newImage}`];
      }

      const finalProduct = {
        ...dbProduct,
        image: Array.isArray(newImage) ? newImage : [newImage]
      };

      setProduct(finalProduct);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
      navigate("/");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
        <div className="loading-container"><div className="spinner"></div></div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const cartItem = cart.find(item => item._id === product._id);
  const images = Array.isArray(product.image) ? product.image : [product.image];
  const originalPrice = product.price || 0;
  const offerPrice = product.offerPrice || originalPrice;
  const discountPercent = originalPrice > offerPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="homepage-wrapper">
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />

      <main className="main-content container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', border: 'none', color: 'var(--primary)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', 
            gap: '8px', fontSize: '16px', fontWeight: '500', marginBottom: '20px'
          }}>
          <FiArrowLeft /> Back
        </button>

        <div className="product-details" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          <div className="product-images" style={{ flex: '1 1 400px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '15px', position: 'relative' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                style={{
                  position: 'absolute', top: '15px', right: '15px', background: 'white', border: '1px solid #eee', 
                  borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', cursor: 'pointer', transition: '0.2s', zIndex: 10,
                  color: isWishlisted ? 'var(--secondary)' : '#ccc'
                }}
              >
                <FiHeart fill={isWishlisted ? 'var(--secondary)' : 'none'} size={20} />
              </button>
              <img
                src={images[activeImage]}
                alt={product.name}
                style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }}
              />
            </div>
            
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={product.name}
                    onClick={() => setActiveImage(index)}
                    style={{ 
                      width: '80px', height: '80px', objectFit: 'contain', cursor: 'pointer',
                      border: activeImage === index ? '2px solid var(--primary)' : '1px solid #eee',
                      borderRadius: '8px', padding: '5px', background: 'white'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info" style={{ flex: '1 1 400px' }}>
            <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '10px' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
              <FiStar fill="#f59e0b" color="#f59e0b" />
              <FiStar fill="#f59e0b" color="#f59e0b" />
              <FiStar fill="#f59e0b" color="#f59e0b" />
              <FiStar fill="#f59e0b" color="#f59e0b" />
              <FiStar fill="#e5e7eb" color="#e5e7eb" />
              <span style={{ color: 'var(--text-light)', fontSize: '14px', marginLeft: '5px' }}>(124 reviews)</span>
            </div>

            <div className="price" style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>₹{offerPrice}</span>
              {discountPercent > 0 && (
                <>
                  <span style={{ fontSize: '18px', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{originalPrice}</span>
                  <span style={{ fontSize: '14px', color: 'var(--secondary)', backgroundColor: '#fff1f2', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{discountPercent}% OFF</span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '30px' }}>
              {product.description || "Looking for a delicious and fresh option? This product is sourced with the highest quality standards to ensure you get the absolute best. Perfect for your daily needs."}
            </p>

            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <FiTruck color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>Free Delivery on orders over ₹500</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiShield color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>100% Secure Checkout</span>
              </div>
            </div>

            {cartItem ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-pill)', padding: '5px' }}>
                  <button 
                    onClick={() => updateCartQuantity(product._id, -1)}
                    style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                  >
                    <FiMinus size={16} color="var(--text-dark)" />
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>{cartItem.qty}</span>
                  <button 
                    onClick={() => updateCartQuantity(product._id, 1)}
                    style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                  >
                    <FiPlus size={16} color="var(--text-dark)" />
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/cart')}
                  style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: 'var(--radius-pill)', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', flex: 1, boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)' }}
                >
                  View Cart
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '16px 30px', borderRadius: 'var(--radius-pill)', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(2, 44, 34, 0.15)', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                Add To Cart
              </button>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
