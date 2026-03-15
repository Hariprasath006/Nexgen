import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminAddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      toast.error("Please fill all required fields and select an image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice || price);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("stock", stock || 50);
      formData.append("image", image);

      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post("http://localhost:5000/api/foods", formData, config);

      if (res.data.success) {
        toast.success("Product Added Successfully");
        setName("");
        setPrice("");
        setOfferPrice("");
        setCategory("");
        setDescription("");
        setStock("");
        setImage(null);
        // Reset file input
        document.getElementById("productImage").value = "";
      } else {
        toast.error(res.data.message || "Error adding product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar cartCount={0} />
      <div className="container" style={{ padding: "40px 0", maxWidth: "600px" }}>
        <h2 style={{ marginBottom: "20px", color: "var(--amazon-nav-belt)" }}>Admin: Add New Product</h2>
        
        <form onSubmit={uploadProduct} className="checkout-card">
          <div className="form-group">
            <label>Product Name *</label>
            <input 
              className="live-search-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="live-search-input"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select 
              className="live-search-input"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
            >
              <option value="">Select Category</option>
              <option value="Organic veggies">Organic veggies</option>
              <option value="Fresh Fruits">Fresh Fruits</option>
              <option value="Cold Drinks">Cold Drinks</option>
              <option value="Instant Food">Instant Food</option>
              <option value="Dairy Products">Dairy Products</option>
              <option value="Bakery & Breads">Bakery & Breads</option>
              <option value="Grains & Cereals">Grains & Cereals</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Original Price (₹) *</label>
              <input 
                type="number"
                className="live-search-input"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Offer Price (₹)</label>
              <input 
                type="number"
                className="live-search-input"
                value={offerPrice} 
                onChange={(e) => setOfferPrice(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Initial Stock Count</label>
              <input 
                type="number"
                className="live-search-input"
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                placeholder="50"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image *</label>
            <input 
              type="file" 
              id="productImage"
              onChange={(e) => setImage(e.target.files[0])} 
              required
            />
          </div>

          <button type="submit" className="btn-checkout" disabled={loading} style={{ marginTop: "20px" }}>
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AdminAddProduct;