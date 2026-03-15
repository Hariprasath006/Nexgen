import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AddressPage({ cart, setCart }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: ""
  });

  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ["firstName", "lastName", "street", "city", "state", "zip", "phone"];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (address.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.offerPrice || item.price) * (item.qty || 1), 0);
      const tax = subtotal * 0.05;
      const delivery = subtotal > 500 ? 0 : 40;
      const finalTotal = subtotal + tax + delivery;

      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          items: cart,
          totalPrice: finalTotal,
          address: address,
          payment: payment
        },
        config
      );

      if (res.data.success) {
        toast.success("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/orders");
      } else {
        toast.error(res.data.message || "Order failed to place");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar cartCount={cart.length} />
      <div className="address-page container">
        <div className="checkout-layout">
          
          <div className="checkout-form-container">
            <h2 className="checkout-step-title">1. Select a delivery address</h2>
            
            <form className="address-form" onSubmit={placeOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" value={address.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" value={address.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Mobile number</label>
                <input name="phone" value={address.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Flat, House no., Building, Company, Apartment</label>
                <input name="street" value={address.street} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Town/City</label>
                  <input name="city" value={address.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={address.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="zip" value={address.zip} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={address.country} readOnly disabled />
                </div>
              </div>

              <h2 className="checkout-step-title" style={{marginTop: '2rem'}}>2. Payment Method</h2>
              <div className="payment-options">
                <div className="radio-option" onClick={() => setPayment("COD")}>
                  <input 
                    type="radio" 
                    id="cod" 
                    name="payment" 
                    value="COD" 
                    checked={payment === "COD"} 
                    onChange={() => setPayment("COD")} 
                  />
                  <label htmlFor="cod">Cash on Delivery / Pay on Delivery</label>
                </div>
                <div className="radio-option" onClick={() => setPayment("Card")}>
                  <input 
                    type="radio" 
                    id="card" 
                    name="payment" 
                    value="Card" 
                    checked={payment === "Card"}
                    onChange={() => setPayment("Card")}
                  />
                  <label htmlFor="card">Credit / Debit Card</label>
                </div>
                <div className="radio-option" onClick={() => setPayment("UPI")}>
                  <input 
                    type="radio" 
                    id="upi" 
                    name="payment" 
                    value="UPI" 
                    checked={payment === "UPI"}
                    onChange={() => setPayment("UPI")}
                  />
                  <label htmlFor="upi">UPI / QR Code</label>
                </div>
              </div>

              {payment === "UPI" && (
                <div className="card-mock-form" style={{marginTop: '15px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <h4 style={{marginBottom: '15px', color: 'var(--text-dark)', fontFamily: "'Outfit', sans-serif"}}>
                    Scan QR Code to Pay ₹{((cart.reduce((sum, i) => sum + ((i.offerPrice||i.price)*i.qty), 0)) * 1.05 + (cart.reduce((s, i) => s + ((i.offerPrice||i.price)*i.qty), 0) > 500 ? 0 : 40)).toFixed(2)}
                  </h4>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=kavin29114@oksbi&pn=FreshShop&cu=INR&am=${((cart.reduce((sum, i) => sum + ((i.offerPrice||i.price)*i.qty), 0)) * 1.05 + (cart.reduce((s, i) => s + ((i.offerPrice||i.price)*i.qty), 0) > 500 ? 0 : 40)).toFixed(2)}`)}`} 
                    alt="Active UPI QR Code" 
                    style={{width: '180px', height: '180px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px', background: 'white', display: 'block'}} 
                  />
                  <p style={{marginTop: '15px', color: 'var(--text-light)', fontSize: '14px', textAlign: 'center', lineHeight: '1.6'}}>
                    Please scan this code using your favorite UPI app (GPay, PhonePe, Paytm).<br/>Once paid, click the button below to complete your order.
                  </p>
                </div>
              )}

              {payment === "Card" && (
                <div className="card-mock-form" style={{marginTop: '15px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: '#f8fafc'}}>
                  <h4 style={{marginBottom: '15px', color: 'var(--text-dark)', fontFamily: "'Outfit', sans-serif"}}>Enter Card Details (Mock)</h4>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required={payment === "Card"} className="auth-input" style={{background: 'white'}} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" maxLength="5" required={payment === "Card"} className="auth-input" style={{background: 'white'}} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="password" placeholder="123" maxLength="4" required={payment === "Card"} className="auth-input" style={{background: 'white'}} />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-checkout" disabled={loading} style={{marginTop: '2rem'}}>
                {loading ? "Processing..." : "Use this address & Place Order"}
              </button>
            </form>
          </div>

          <div className="checkout-summary-sidebar">
            <div className="checkout-card sticky-sidebar">
              <button className="btn-checkout" onClick={placeOrder} disabled={loading}>
                Place Your Order
              </button>
              <p className="terms-text">By placing your order, you agree to FreshShop's privacy notice and conditions of use.</p>
              
              <hr />
              <h3>Order Summary</h3>
              <div className="price-breakdown">
                <div className="flex-between"><span>Items ({cart.length}):</span> <span>₹{cart.reduce((sum, i) => sum + ((i.offerPrice||i.price)*i.qty), 0).toFixed(2)}</span></div>
                <div className="flex-between"><span>Delivery:</span> <span>₹{cart.reduce((s, i) => s + ((i.offerPrice||i.price)*i.qty), 0) > 500 ? '0.00' : '40.00'}</span></div>
                <hr />
                <div className="flex-between total-row">
                  <span style={{color: '#B12704'}}>Order Total:</span> 
                  <span style={{color: '#B12704'}}>
                    ₹{((cart.reduce((sum, i) => sum + ((i.offerPrice||i.price)*i.qty), 0)) * 1.05 + (cart.reduce((s, i) => s + ((i.offerPrice||i.price)*i.qty), 0) > 500 ? 0 : 40)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddressPage;