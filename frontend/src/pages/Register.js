import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem("token", res.data.data.token);
        
        toast.success("Account created successfully!");
        navigate(redirect);
      } else {
        toast.error(res.data.message || "Registration failed");
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
        <h1>Create Account</h1>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Your name</label>
            <input 
              type="text" 
              placeholder="First and last name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className="auth-input"
            />
          </div>
          
          <div className="form-group">
            <label>Mobile number or email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="auth-input"
            />
          </div>
          
          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="At least 6 characters"
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

          <div className="form-group">
            <label>Re-enter password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              className="auth-input"
            />
          </div>
          
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? <div className="spinner auth-spinner"></div> : "Continue"}
          </button>
          
          <p className="auth-terms">
            By creating an account, you agree to FreshShop's 
            <Link to="/conditions"> Conditions of Use</Link> and <Link to="/privacy">Privacy Notice</Link>.
          </p>

          <div className="auth-help-bottom">
            <p>Already have an account? <Link to={`/login?redirect=${redirect}`}>Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
