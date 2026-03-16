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
}, [id]);

const fetchProductDetails = async () => {
try {

```
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
  }
  else if (
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
```

};

if (loading) {
return (
<> <Navbar cartCount={cart.length}/> <div className="loading-container"><div className="spinner"></div></div> <Footer/>
</>
);
}

if (!product) return null;

const cartItem = cart.find(item => item._id === product._id);

const images = Array.isArray(product.image) ? product.image : [product.image];

const originalPrice = product.price || 0;
const offerPrice = product.offerPrice || originalPrice;

const discountPercent =
originalPrice > offerPrice
? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
: 0;

return ( <div className="homepage-wrapper">

```
  <Navbar cartCount={cart.length} />

  <main className="main-content container">

    <button onClick={() => navigate(-1)}>
      <FiArrowLeft/> Back
    </button>

    <div className="product-details">

      <div className="product-images">

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={product.name}
            onClick={() => setActiveImage(index)}
          />
        ))}

        <img
          src={images[activeImage]}
          alt={product.name}
          className="main-product-image"
        />

      </div>

      <div className="product-info">

        <h1>{product.name}</h1>

        <div className="price">
          <span>₹{offerPrice}</span>
          {discountPercent > 0 && (
            <span className="old-price">₹{originalPrice}</span>
          )}
        </div>

        {cartItem ? (
          <div className="qty-controls">
            <button onClick={() => updateCartQuantity(product._id,-1)}>
              <FiMinus/>
            </button>
            <span>{cartItem.qty}</span>
            <button onClick={() => updateCartQuantity(product._id,1)}>
              <FiPlus/>
            </button>
          </div>
        ) : (
          <button onClick={() => addToCart(product)}>
            Add To Cart
          </button>
        )}

      </div>

    </div>

  </main>

  <Footer/>

</div>
```

);
}

export default ProductDetails;
