import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiBox, FiList, FiShield, FiHeart } from "react-icons/fi";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.email === "admin@example.com";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <nav className="amazon-navbar">
      <div className="navbar-top">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={28} color="var(--primary)" /> : <FiMenu size={28} color="var(--primary)" />}
        </button>

        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="logo-text">Fresh<span className="logo-highlight">Shop</span></span>
        </div>

        {/* Modern Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search groceries, beverages, snacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-submit">
            <FiSearch size={20} />
          </button>
        </form>

        {/* Right Nav Options */}
        <div className="navbar-right">
          
          {/* User Profile */}
          <div className="nav-item profile-menu-container"
               onMouseEnter={() => setIsProfileOpen(true)}
               onMouseLeave={() => setIsProfileOpen(false)}>
            <div className="nav-item-icon">
              <FiUser size={22} />
            </div>
            <div className="nav-item-content">
              <span className="nav-greeting">{user ? `Welcome, ${user.name.split(' ')[0]}` : 'Sign in'}</span>
              <span className="nav-bold">My Account <FiChevronDown strokeWidth={3} /></span>
            </div>

            {isProfileOpen && (
              <div className="profile-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <p style={{ color: "var(--text-light)", fontSize: "13px", marginTop: "4px" }}>{user.email}</p>
                    </div>
                    <Link to="/orders" className="dropdown-item"><FiBox style={{marginRight: "8px"}}/> My Orders</Link>
                    <Link to="/wishlist" className="dropdown-item"><FiHeart style={{marginRight: "8px"}}/> My Wishlist</Link>
                    <Link to="/address" className="dropdown-item"><FiList style={{marginRight: "8px"}}/> Saved Addresses</Link>
                    {isAdmin && (
                      <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "10px", paddingTop: "10px" }}>
                        <Link to="/admin-add" className="dropdown-item" style={{color: "var(--primary)"}}>Add Product</Link>
                        <Link to="/admin-dashboard" className="dropdown-item" style={{color: "var(--primary)"}}>Admin Dashboard</Link>
                      </div>
                    )}
                    <button onClick={handleLogout} className="dropdown-item logout-btn" style={{color: "var(--secondary)", marginTop: "10px"}}>Sign Out</button>
                  </>
                ) : (
                  <div className="dropdown-login-box">
                    <button onClick={() => navigate("/login")} className="btn-primary-dropdown" style={{width: "100%"}}>Sign in</button>
                    <p style={{marginTop: "15px", fontSize: "14px"}}>New customer? <Link to="/register" style={{color: "var(--primary)", fontWeight: "600"}}>Register here</Link></p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Dashboard Explicit Link (Hidden on small screens) */}
          {isAdmin && (
            <div className="nav-item hide-on-mobile" onClick={() => navigate("/admin-dashboard")}>
              <div className="nav-item-icon">
                <FiShield size={22} color="var(--primary)" />
              </div>
              <div className="nav-item-content">
                <span className="nav-greeting" style={{color: "var(--primary)"}}>Manage</span>
                <span className="nav-bold" style={{color: "var(--primary)"}}>Admin</span>
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <div className="nav-item hide-on-mobile" onClick={() => navigate("/wishlist")}>
            <div className="nav-item-icon" style={{ position: "relative" }}>
              <FiHeart size={24} />
              {wishlistCount > 0 && <span className="cart-badge-new">{wishlistCount}</span>}
            </div>
            <span className="nav-bold hide-on-mobile" style={{ marginLeft: "5px" }}>Wishlist</span>
          </div>

          {/* Stylish Cart Button */}
          <div className="nav-item nav-cart" onClick={() => navigate("/cart")}>
            <div className="nav-item-icon">
              <FiShoppingBag size={24} strokeWidth={2.5} />
              <span className="cart-badge-new">{cartCount}</span>
            </div>
            <span className="nav-bold cart-text hide-on-mobile">Cart</span>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
          {isAdmin && <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>}
          {user ? (
            <Link to="#" onClick={handleLogout} style={{ color: "var(--secondary)" }}>Sign Out</Link>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;