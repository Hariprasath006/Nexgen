import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" or "orders"
  
  // Inventory State
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentCount, setRecentCount] = useState(0);
  const [editingFood, setEditingFood] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", offerPrice: "", category: "", stock: 0 });
  const [editLoading, setEditLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchFoods();
    fetchOrders(); // Prefetch orders
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get("https://nexgen-yg2a.onrender.com/api/foods", config);
      let fetchedFoods = res.data?.data || res.data || [];
      const mappedDbFoods = fetchedFoods.map(food => {
        let newImage = food.image;
        if (Array.isArray(newImage) && newImage[0] && typeof newImage[0] === 'string' && newImage[0].startsWith('uploads/')) {
           newImage = [`https://nexgen-yg2a.onrender.com/${newImage[0]}`];
        } else if (typeof newImage === 'string' && newImage.startsWith('uploads/')) {
           newImage = `https://nexgen-yg2a.onrender.com/${newImage}`;
        }
        return { ...food, image: newImage };
      });
      setFoods(mappedDbFoods);
      setRecentCount(fetchedFoods.length);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products from backend.");
      setFoods([]);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await axios.get("https://nexgen-yg2a.onrender.com/api/orders");
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`https://nexgen-yg2a.onrender.com/api/orders/status/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating order status.");
    }
  };

  // --- Handlers for Inventory ---
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
      const res = await axios.put(`https://nexgen-yg2a.onrender.com/api/foods/${editingFood._id}`, editForm, config);
      if (res.data.success) {
        toast.success("Product updated successfully!");
        setEditingFood(null);
        fetchFoods();
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
        const res = await axios.delete(`https://nexgen-yg2a.onrender.com/api/foods/${id}`, config);
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
    <div className="homepage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar cartCount={0} />
      
      <main className="main-content container" style={{ padding: "40px 15px", flex: 1 }}>
        <div className="section-header" style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "28px", color: "var(--text-dark)", margin: 0, fontFamily: "'Outfit', sans-serif" }}>Admin Dashboard</h2>
          
          <div style={{ display: "flex", background: "white", borderRadius: "12px", padding: "5px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
             <button 
                onClick={() => setActiveTab("inventory")}
                style={{ 
                  background: activeTab === "inventory" ? "var(--primary)" : "transparent",
                  color: activeTab === "inventory" ? "white" : "var(--text-light)",
                  border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "600",
                  cursor: "pointer", transition: "0.2s"
                }}
              >
                Inventory
             </button>
             <button 
                onClick={() => setActiveTab("orders")}
                style={{ 
                  background: activeTab === "orders" ? "var(--primary)" : "transparent",
                  color: activeTab === "orders" ? "white" : "var(--text-light)",
                  border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "600",
                  cursor: "pointer", transition: "0.2s"
                }}
              >
                Orders
             </button>
          </div>
        </div>

        {/* ===================== INVENTORY TAB ===================== */}
        {activeTab === "inventory" && (
          <div className="dashboard-fade-in">
            <div className="metrics" style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
              <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", flex: 1 }}>
                <h3 style={{ color: "var(--primary-dark)", fontSize: "32px", margin: "0", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  {foods.length} <span style={{ fontSize: "14px", color: "var(--text-light)", fontWeight: "normal" }}>Items</span>
                </h3>
                <p style={{ color: "var(--text-dark)", fontSize: "15px", fontWeight: "600", margin: "5px 0 0" }}>Total Products</p>
              </div>
              <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", flex: 1 }}>
                <h3 style={{ color: "#10b981", fontSize: "32px", margin: "0", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  {recentCount} <span style={{ fontSize: "14px", color: "var(--text-light)", fontWeight: "normal" }}>Items</span>
                </h3>
                <p style={{ color: "var(--text-dark)", fontSize: "15px", fontWeight: "600", margin: "5px 0 0" }}>Custom Added</p>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
              <div style={{ padding: "20px 25px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-dark)", fontWeight: "600" }}>Manage Inventory</h3>
                <a href="/admin-add" className="btn-primary" style={{ padding: "10px 18px", fontSize: "14px", borderRadius: "var(--radius-pill)" }}>+ Add New Product</a>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ backgroundColor: "#f8fafc" }}>
                    <tr>
                      <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Product</th>
                      <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category</th>
                      <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                      <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stock Status</th>
                      <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => {
                      const imageSrc = food.image && Array.isArray(food.image) ? food.image[0] : food.image;
                      const stockCount = food.stock !== undefined ? food.stock : 50;
                      const isLowStock = stockCount <= 10;
                      const stockLabel = stockCount <= 0 ? "Out of Stock (0)" : (isLowStock ? `Low Stock (${stockCount})` : `In Stock (${stockCount})`);
                      const stockColor = stockCount <= 0 ? "#ef4444" : (isLowStock ? "#f59e0b" : "#10b981");
                      const stockBg = stockCount <= 0 ? "#fef2f2" : (isLowStock ? "#fffbeb" : "#ecfdf5");

                      return (
                        <tr key={food._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                          <td style={{ padding: "15px 25px", display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", backgroundColor: "#fff" }}>
                              {imageSrc ? (
                                <img src={imageSrc} alt={food.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "4px" }} />
                              ) : (
                                <span style={{ fontSize: "10px", color: "#94a3b8" }}>No Img</span>
                              )}
                            </div>
                            <div>
                              <p style={{ margin: "0", fontWeight: "600", color: "var(--text-dark)", fontSize: "15px" }}>{food.name}</p>
                              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-light)" }}>ID: {food._id.substring(0,8)}</p>
                            </div>
                          </td>
                          <td style={{ padding: "15px 25px" }}>
                            <span style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#f8fafc", borderRadius: "50px", fontSize: "12px", color: "var(--text-dark)", fontWeight: "500", border: "1px solid #e2e8f0" }}>
                              {food.category}
                            </span>
                          </td>
                          <td style={{ padding: "15px 25px", fontWeight: "600", color: "var(--text-dark)", fontSize: "15px" }}>₹{food.offerPrice || food.price}</td>
                          <td style={{ padding: "15px 25px" }}>
                            <span style={{ color: stockColor, backgroundColor: stockBg, padding: "6px 12px", borderRadius: "50px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: stockColor }}></span>
                              {stockLabel}
                            </span>
                          </td>
                          <td style={{ padding: "15px 25px", textAlign: "right" }}>
                            <button onClick={() => handleEditClick(food)} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "14px", fontWeight: "600", padding: "8px 12px", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.opacity=0.7} onMouseOut={e=>e.currentTarget.style.opacity=1}>Edit</button>
                            <span style={{ color: "#e2e8f0", margin: "0 2px" }}>|</span>
                            <button onClick={() => deleteProduct(food._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: "600", padding: "8px 12px", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.opacity=0.7} onMouseOut={e=>e.currentTarget.style.opacity=1}>Delete</button>
                          </td>
                        </tr>
                      )
                    })}
                    {foods.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>No products found in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== ORDERS TAB ===================== */}
        {activeTab === "orders" && (
          <div className="dashboard-fade-in">
            {ordersLoading ? (
               <div style={{ textAlign: "center", padding: "50px" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
            ) : (
               <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                  <div style={{ padding: "20px 25px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-dark)", fontWeight: "600" }}>Manage Customer Orders</h3>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead style={{ backgroundColor: "#f8fafc" }}>
                        <tr>
                          <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Order Details</th>
                          <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer</th>
                          <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Amount</th>
                          <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Purchase Date</th>
                          <th style={{ padding: "16px 25px", borderBottom: "2px solid #f1f5f9", color: "var(--text-light)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Delivery Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const dateObj = new Date(order.createdAt);
                          const formattedDate = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
                          return (
                            <tr key={order._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                              <td style={{ padding: "15px 25px" }}>
                                <p style={{ margin: "0", fontWeight: "600", color: "var(--text-dark)", fontSize: "14px" }}>
                                  #{order._id.substring(order._id.length - 6).toUpperCase()}
                                </p>
                                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-light)" }}>
                                  {order.items?.length || 0} Items
                                </p>
                              </td>
                              <td style={{ padding: "15px 25px" }}>
                                <p style={{ margin: "0", fontWeight: "500", color: "var(--text-dark)", fontSize: "14px" }}>{order.address?.firstName || "Guest"} {order.address?.lastName || ""}</p>
                                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-light)" }}>{order.address?.phone || "N/A"}</p>
                              </td>
                              <td style={{ padding: "15px 25px", fontWeight: "600", color: "var(--primary-dark)", fontSize: "15px" }}>
                                ₹{order.totalPrice || 0}
                              </td>
                              <td style={{ padding: "15px 25px", color: "var(--text-dark)", fontSize: "14px" }}>
                                {formattedDate}
                              </td>
                              <td style={{ padding: "15px 25px", textAlign: "right" }}>
                                <select 
                                  value={order.status || "Ordered"} 
                                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    background: "#f8fafc",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: order.status === "Delivered" ? "#10b981" : (order.status === "Shipped" || order.status === "Packed" ? "var(--secondary)" : "var(--primary)"),
                                    cursor: "pointer",
                                    outline: "none"
                                  }}
                                >
                                  <option value="Ordered" style={{color:"black"}}>Order Placed</option>
                                  <option value="Packed" style={{color:"black"}}>Packed</option>
                                  <option value="Shipped" style={{color:"black"}}>Shipped</option>
                                  <option value="Delivered" style={{color:"black"}}>Delivered</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>No customer orders found yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}
          </div>
        )}

        {/* ===================== EDIT INVENTORY MODAL ===================== */}
        {editingFood && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999}}>
            <div style={{ background: "white", padding: "35px", borderRadius: "20px", width: "90%", maxWidth: "450px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ margin: 0, fontSize: "22px", fontFamily: "'Outfit', sans-serif", color: "var(--text-dark)" }}>Edit Product</h3>
                <button onClick={() => setEditingFood(null)} style={{ background: "none", border: "none", fontSize: "24px", color: "var(--text-light)", cursor: "pointer" }}>&times;</button>
              </div>
              
              <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-dark)" }}>Product Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-dark)" }}>List Price (₹)</label>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-dark)" }}>Offer Price (₹)</label>
                    <input type="number" value={editForm.offerPrice} onChange={e => setEditForm({...editForm, offerPrice: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-dark)" }}>Category</label>
                    <input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--text-dark)" }}>Stock Count</label>
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setEditingFood(null)} className="btn-secondary" style={{ flex: 1, padding: "14px", borderRadius: "12px" }} disabled={editLoading}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "var(--primary)" }} disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
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
