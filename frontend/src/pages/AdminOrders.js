import React,{useEffect,useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminOrders(){
  const [orders,setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/orders")
      .then(res => {
        setOrders(res.data.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Error fetching orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, { status: newStatus });
      if(res.data.success) {
        toast.success("Order status updated!");
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch(err) {
      toast.error("Error updating status");
    }
  };

  return(
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar cartCount={0} />
      <div className="container" style={{padding:"40px 0", flex: 1}}>
        <h2 style={{marginBottom: "20px"}}>Manage Orders (Admin View)</h2>
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order)=>(
              <div key={order._id} className="order-history-card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                  <h3 style={{fontSize: '18px'}}>Order ID: {order._id}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <strong>Update Status:</strong>
                    <select 
                      value={order.status || "Order Placed"} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="live-search-input"
                      style={{width: 'auto', padding: '8px 15px'}}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="order-items" style={{marginBottom: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                  {order.items && order.items.map((item,index)=>(
                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                      <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} style={{width: '40px', height: '40px', objectFit: 'contain'}}/>
                      <div>
                        <div style={{fontWeight: '600', fontSize: '14px'}}>{item.name}</div>
                        <div style={{fontSize: '12px', color: 'var(--text-light)'}}>Qty: {item.qty || 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{background: '#f1f5f9', padding: '15px', borderRadius: '8px'}}>
                  <p style={{marginBottom: '5px'}}><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Shipping Address:</strong> {order.address ? `${order.address.firstName} ${order.address.lastName}, ${order.address.street}, ${order.address.city}, ${order.address.zip}` : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default AdminOrders;