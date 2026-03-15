import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {
  const [email, setEmail] = useState("admin@example.com"); // default for convenience
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password
      });

      if (res.data.success) {
        if (res.data.data.email !== "admin@example.com") {
             toast.error("Not an admin account");
             setLoading(false);
             return;
        }

        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem("token", res.data.data.token);
        
        toast.success("Admin Login Successful!");
        navigate("/admin-dashboard");
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: '#f8fafc' }}>
      <div className="auth-logo" onClick={() => navigate('/')}>
        <h2 style={{color: 'var(--primary)', fontFamily: "'Outfit', sans-serif", fontSize: '32px'}}>
          FreshShop <span style={{color: '#ea580c'}}>Admin</span>
        </h2>
      </div>
      
      <div className="auth-container" style={{ borderTop: '4px solid var(--primary)', maxWidth: '450px' }}>
        <h1 style={{fontSize: '24px'}}>Admin Portal Access</h1>
        <p style={{marginBottom: '20px', color: 'var(--text-light)', fontSize: '15px'}}>Sign in to manage products and customer orders.</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{marginBottom: '15px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)'}}>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="auth-input"
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}
            />
          </div>
          
          <div className="form-group" style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)'}}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="auth-input"
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            {loading ? "Authenticating..." : "Login to Admin Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
