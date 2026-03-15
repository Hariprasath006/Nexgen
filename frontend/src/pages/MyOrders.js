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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login?redirect=/orders");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/orders/myorders", {
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
    toast.info(`Fetching live tracking for Order #${displayId}...`, { autoClose: 2000 });
    setTimeout(() => {
      toast.success(`Package is currently in transit to you!`);
    }, 2000);
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
      </div>
      <Footer />
    </>
  );
}

export default MyOrders;