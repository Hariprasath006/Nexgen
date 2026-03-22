import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login?redirect=/orders");
        return;
      }

      try {
        const res = await axios.get("https://nexgen-yg2a.onrender.com/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          toast.error("Failed to load orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "order placed": return <FiClock />;
      case "packed": return <FiPackage />;
      case "shipped": return <FiTruck />;
      case "delivered": return <FiCheckCircle color="green" />;
      default: return <FiClock />;
    }
  };

  const getStatusStep = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "delivered") return 4;
    if (s === "shipped") return 3;
    if (s === "packed") return 2;
    return 1;
  };

  const handleTrackPackage = (orderId) => {
    const displayId = orderId && typeof orderId === 'string' ? orderId.substring(Math.max(0, orderId.length - 6)) : 'NEW';
    setTrackingOrder(displayId);
  };

  return (
    <>
      <Navbar cartCount={0} />
      <div className="orders-page container">
        <h1 className="page-heading">Your Orders</h1>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-orders-message">
            <h2>Looks like you haven't placed an order yet.</h2>
            <button className="btn-secondary" onClick={() => navigate("/")}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              
              return (
                <div className="order-history-card" key={order._id}>
                  <div className="order-header">
                    <div className="order-meta">
                      <div className="meta-block">
                        <span className="meta-label">ORDER PLACED</span>
                        <span className="meta-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">TOTAL</span>
                        <span className="meta-value">₹{order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">SHIP TO</span>
                        <span className="meta-value address-tooltip" title={`${order.address?.street}, ${order.address?.city}`}>
                          {order.address?.firstName} {order.address?.lastName}
                        </span>
                      </div>
                    </div>
                    <div className="order-actions-top">
                      <span className="order-id">ORDER # {order._id.substring(18)}</span>
                      <div className="action-links">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a href="#">View order details</a> | {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}<a href="#">Invoice</a>
                      </div>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="delivery-status">
                      <h3 className="status-title">
                        {getStatusIcon(order.status)} 
                        <span style={{marginLeft: '10px'}}>{order.status || "Order Placed"}</span>
                      </h3>
                      
                      {/* Timeline */}
                      <div className="status-timeline">
                        <div className={`timeline-step ${currentStep >= 1 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-text">Placed</span>
                        </div>
                        <div className={`timeline-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                        <div className={`timeline-step ${currentStep >= 2 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-text">Packed</span>
                        </div>
                        <div className={`timeline-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                        <div className={`timeline-step ${currentStep >= 3 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-text">Shipped</span>
                        </div>
                        <div className={`timeline-line ${currentStep >= 4 ? 'active' : ''}`}></div>
                        <div className={`timeline-step ${currentStep >= 4 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-text">Delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-items">
                      {(order.items || []).map((item, i) => (
                        <div className="order-item-row" key={i}>
                          <img 
                            src={Array.isArray(item.image) ? item.image[0] : item.image} 
                            alt={item.name} 
                            className="order-item-img"
                          />
                          <div className="order-item-info">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#" className="item-link" onClick={(e) => { e.preventDefault(); navigate(`/products`); }}>{item.name}</a>
                            <p className="item-qty">Qty: {item.qty || 1}</p>
                            <p className="item-price">₹{item.offerPrice || item.price}</p>
                            
                            <div className="item-buttons">
                              <button className="btn-buy-again" onClick={() => { navigate(`/product/${item._id}`); }}>Buy it again</button>
                              <button className="btn-track" onClick={() => handleTrackPackage(order._id)}>Track package</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {trackingOrder && (
        <div className="tracking-modal-overlay" style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="tracking-modal-content" style={{background:'white', width:'90%', maxWidth:'450px', borderRadius:'12px', padding:'30px', position:'relative', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'}}>
            <button style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', fontSize:'24px', cursor:'pointer', color:'#888', padding:0}} onClick={() => setTrackingOrder(null)}>×</button>
            <h2 style={{marginBottom:'20px', fontFamily:"'Outfit', sans-serif", color:'var(--text-dark)'}}>Track Package</h2>
            
            <div style={{color:'var(--text-light)', marginBottom:'25px', fontSize:'14px'}}>
              Order #{trackingOrder}<br/>
              Expected Delivery: <strong style={{color:'var(--primary)'}}>Tomorrow by 9:00 PM</strong>
            </div>

            <div className="tracking-vertical-timeline" style={{borderLeft:'3px solid var(--primary-light)', marginLeft:'15px', paddingLeft:'25px'}}>
              <div style={{position:'relative', marginBottom:'30px'}}>
                <div style={{position:'absolute', left:'-35px', top:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'var(--primary)', border:'3px solid white', boxShadow:'0 0 0 2px var(--primary)'}}></div>
                <h4 style={{margin:0, color:'var(--text-dark)', fontSize:'15px'}}>Ordered & Processed</h4>
                <p style={{margin:'4px 0 0 0', color:'var(--text-light)', fontSize:'13px'}}>Seller has processed your order.</p>
              </div>

              <div style={{position:'relative', marginBottom:'30px'}}>
                <div style={{position:'absolute', left:'-35px', top:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'var(--primary)', border:'3px solid white', boxShadow:'0 0 0 2px var(--primary)'}}></div>
                <h4 style={{margin:0, color:'var(--text-dark)', fontSize:'15px'}}>Shipped</h4>
                <p style={{margin:'4px 0 0 0', color:'var(--text-light)', fontSize:'13px'}}>Package arrived at regional sorting facility.</p>
              </div>

              <div style={{position:'relative', marginBottom:'30px'}}>
                <div style={{position:'absolute', left:'-35px', top:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'var(--secondary)', border:'3px solid white', boxShadow:'0 0 0 2px var(--secondary)'}}></div>
                <h4 style={{margin:0, color:'var(--text-dark)', fontSize:'15px'}}>Out for Delivery</h4>
                <p style={{margin:'4px 0 0 0', color:'var(--text-light)', fontSize:'13px'}}>Your package is with the delivery agent.</p>
              </div>

              <div style={{position:'relative'}}>
                <div style={{position:'absolute', left:'-35px', top:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'#e2e8f0', border:'3px solid white'}}></div>
                <h4 style={{margin:0, color:'#94a3b8', fontSize:'15px'}}>Delivered</h4>
                <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'13px'}}>Pending final delivery.</p>
              </div>
            </div>
            
            <div style={{marginTop:'35px', textAlign:'center'}}>
              <button className="btn-secondary" style={{width:'100%', padding:'10px', borderRadius:'var(--radius-pill)', fontWeight:'bold'}} onClick={() => setTrackingOrder(null)}>Close Map Tracker</button>
            </div>
          </div>
        </div>
      )}

      </div>
      <Footer />
    </>
  );
}

export default MyOrders;
