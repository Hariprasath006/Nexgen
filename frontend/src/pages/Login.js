import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

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
        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem("token", res.data.data.token);
        
        toast.success("Login Successful!");
        navigate(redirect);
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
    <div className="auth-page">
      <div className="auth-logo" onClick={() => navigate('/')}>
        <h2>FreshShop</h2>
      </div>
      
      <div className="auth-container">
        <h1>Sign in</h1>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email or mobile phone number</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="auth-input"
            />
          </div>
          
          <div className="form-group password-group">
            <div className="password-header">
              <label>Password</label>
            </div>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="auth-input"
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? <div className="spinner auth-spinner"></div> : "Continue"}
          </button>
          
          <p className="auth-terms">
            By continuing, you agree to FreshShop's{" "}
            <Link to="/conditions">Conditions of Use</Link> and{" "}
            <Link to="/privacy">Privacy Notice</Link>.
          </p>
          
          <div className="auth-help">
            <Link to="/help">Need help?</Link>
          </div>
        </form>
      </div>
      
      <div className="auth-divider">
        <h5>New to FreshShop?</h5>
      </div>
      
      <button 
        className="btn-create-account" 
        onClick={() => navigate("/register")}
      >
        Create your FreshShop account
      </button>
    </div>
  );
}

export default Login;