import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentCount, setRecentCount] = useState(0);
  
  // Edit Modal State
  const [editingFood, setEditingFood] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", offerPrice: "", category: "", stock: 0 });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.get("http://localhost:5000/api/foods", config);
      let fetchedFoods = res.data?.data || res.data || [];
      
      // Map backend uploaded images safely
      const mappedDbFoods = fetchedFoods.map(food => {
        let newImage = food.image;
        if (Array.isArray(newImage) && newImage[0] && typeof newImage[0] === 'string' && newImage[0].startsWith('uploads/')) {
           newImage = [`http://localhost:5000/${newImage[0]}`];
        } else if (typeof newImage === 'string' && newImage.startsWith('uploads/')) {
           newImage = `http://localhost:5000/${newImage}`;
        }
        return { ...food, image: newImage };
      });

      setFoods(mappedDbFoods);
      setRecentCount(fetchedFoods.length); // Assume everything fetched from API is custom/recent
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products from backend.");
      setFoods([]);
      setLoading(false);
    }
  };

  const handleEditClick = (food) => {
    setEditingFood(food);
    setEditForm({
      name: food.name,
      price: food.price || "",
      offerPrice: food.offerPrice || "",
      category: food.category || "",
      stock: food.stock !== undefined ? food.stock : 50
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await axios.put(`http://localhost:5000/api/foods/${editingFood._id}`, editForm, config);
      if (res.data.success) {
        toast.success("Product updated successfully!");
        setEditingFood(null);
        fetchFoods(); // refresh list
      }
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setEditLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        // Perform standard MongoDB delete
        const res = await axios.delete(`http://localhost:5000/api/foods/${id}`, config);
        if (res.data.success) {
          toast.success("Product deleted successfully");
          setFoods(foods.filter(f => f._id !== id));
        }
      } catch (err) {
        toast.error("Error deleting product");
      }
    }
  };

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <Navbar cartCount={0} />
        <div className="loading-container"><div className="spinner"></div></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage-wrapper">
      <Navbar cartCount={0} />
      
      <main className="main-content container" style={{ padding: "30px 15px" }}>
        <div className="section-header" style={{ marginBottom: "30px" }}>
          <h2>Admin Dashboard</h2>
          <div className="metrics" style={{ display: "flex", gap: "20px" }}>
            <div style={{ background: "white", padding: "15px 25px", borderRadius: "8px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <h3 style={{ color: "var(--primary)", fontSize: "28px", margin: "0" }}>{foods.length}</h3>
              <p style={{ color: "#565959", fontSize: "14px", margin: "5px 0 0" }}>Total Products</p>
            </div>
            <div style={{ background: "white", padding: "15px 25px", borderRadius: "8px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <h3 style={{ color: "#007600", fontSize: "28px", margin: "0" }}>{recentCount}</h3>
              <p style={{ color: "#565959", fontSize: "14px", margin: "5px 0 0" }}>Custom Added</p>
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "8px", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>Inventory & Stock Management</h3>
            <a href="/admin-add" className="btn-primary" style={{ padding: "8px 15px", fontSize: "14px" }}>+ Add New Product</a>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ padding: "15px", borderBottom: "2px solid #ddd", color: "#565959", fontWeight: "600", fontSize: "14px" }}>Product</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #ddd", color: "#565959", fontWeight: "600", fontSize: "14px" }}>Category</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #ddd", color: "#565959", fontWeight: "600", fontSize: "14px" }}>Price</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #ddd", color: "#565959", fontWeight: "600", fontSize: "14px" }}>Stock Status</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #ddd", color: "#565959", fontWeight: "600", fontSize: "14px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => {
                  const imageSrc = food.image && Array.isArray(food.image) ? food.image[0] : food.image;
                  
                  // Use real DB stock or fallback
                  const stockCount = food.stock !== undefined ? food.stock : 50;
                  
                  const isLowStock = stockCount <= 10;
                  const stockLabel = stockCount <= 0 ? "Out of Stock (0)" : (isLowStock ? `Low Stock (${stockCount})` : `In Stock (${stockCount})`);
                  const stockColor = stockCount <= 0 ? "#B12704" : (isLowStock ? "#eab308" : "#007600");

                  return (
                    <tr key={food._id} style={{ borderBottom: "1px solid #eee", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fdfdfd"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                      <td style={{ padding: "15px", display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", backgroundColor: "#fff" }}>
                          {imageSrc ? (
                            <img src={imageSrc} alt={food.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "10px", color: "#999" }}>No Img</span>
                          )}
                        </div>
                        <div>
                          <p style={{ margin: "0", fontWeight: "500", color: "#0f1111" }}>{food.name}</p>
                          <p style={{ margin: "0", fontSize: "12px", color: "#565959" }}>ID: {food._id.substring(0,8)}...</p>
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "#f0f2f2", borderRadius: "4px", fontSize: "12px", color: "#0f1111", border: "1px solid #d5d9d9" }}>
                          {food.category}
                        </span>
                      </td>
                      <td style={{ padding: "15px", fontWeight: "500", color: "#0f1111" }}>₹{food.offerPrice || food.price}</td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ color: stockColor, fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "5px" }}>
                          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: stockColor }}></span>
                          {stockLabel}
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "right" }}>
                        <button onClick={() => handleEditClick(food)} style={{ background: "none", border: "none", color: "#007185", cursor: "pointer", fontSize: "14px", padding: "5px 10px", display: "inline-block" }}>Edit</button>
                        <span style={{ color: "#ddd", margin: "0 5px" }}>|</span>
                        <button onClick={() => deleteProduct(food._id)} style={{ background: "none", border: "none", color: "#B12704", cursor: "pointer", fontSize: "14px", padding: "5px 10px", display: "inline-block" }}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
                {foods.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#565959" }}>No products found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal overlays table */}
        {editingFood && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000}}>
            <div style={{ background: "white", padding: "30px", borderRadius: "8px", width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <h3 style={{ marginTop: 0 }}>Edit Product</h3>
              <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "5px", color: "#565959" }}>Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} />
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px", color: "#565959" }}>Price (₹)</label>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px", color: "#565959" }}>Offer (₹)</label>
                    <input type="number" value={editForm.offerPrice} onChange={e => setEditForm({...editForm, offerPrice: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px", color: "#565959" }}>Category</label>
                    <input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px", color: "#565959" }}>Stock</label>
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: "10px" }} disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setEditingFood(null)} className="btn-secondary" style={{ flex: 1, padding: "10px" }} disabled={editLoading}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;