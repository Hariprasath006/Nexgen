import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer style={{ marginTop: 'auto' }}>
      <div 
        onClick={scrollToTop} 
        style={{ 
          backgroundColor: 'var(--primary-light)', 
          color: 'white', 
          textAlign: 'center', 
          padding: '15px 0',
          cursor: 'pointer',
          fontSize: '13px'
        }}
        className="back-to-top"
      >
        Back to top
      </div>

      <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '40px 20px' }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '30px' 
        }}>
          <div>
            <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '16px' }}>Get to Know Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li><Link to="/about-us" style={{ color: '#e2e8f0', fontSize: '14px' }}>About Us</Link></li>
              <li><Link to="/careers" style={{ color: '#e2e8f0', fontSize: '14px' }}>Careers</Link></li>
              <li><Link to="/press-releases" style={{ color: '#e2e8f0', fontSize: '14px' }}>Press Releases</Link></li>
              <li><Link to="/freshshop-science" style={{ color: '#e2e8f0', fontSize: '14px' }}>FreshShop Science</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '16px' }}>Connect with Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#ddd', fontSize: '14px' }}>Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#ddd', fontSize: '14px' }}>Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#ddd', fontSize: '14px' }}>Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '16px' }}>Make Money with Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li><Link to="/sell-on-freshshop" style={{ color: '#e2e8f0', fontSize: '14px' }}>Sell on FreshShop</Link></li>
              <li><Link to="/protect-and-build-your-brand" style={{ color: '#e2e8f0', fontSize: '14px' }}>Protect and Build Your Brand</Link></li>
              <li><Link to="/global-selling" style={{ color: '#e2e8f0', fontSize: '14px' }}>Global Selling</Link></li>
              <li><Link to="/become-an-affiliate" style={{ color: '#e2e8f0', fontSize: '14px' }}>Become an Affiliate</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '16px' }}>Let Us Help You</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li><Link to="/orders" style={{ color: '#ddd', fontSize: '14px' }}>Your Account</Link></li>
              <li><Link to="/returns-centre" style={{ color: '#ddd', fontSize: '14px' }}>Returns Centre</Link></li>
              <li><Link to="/100-purchase-protection" style={{ color: '#ddd', fontSize: '14px' }}>100% Purchase Protection</Link></li>
              <li><Link to="/help" style={{ color: '#ddd', fontSize: '14px' }}>Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#022c22', padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ color: 'white', display: 'inline', marginRight: '20px', fontFamily: "'Outfit', sans-serif" }}>FreshShop</h2>
        </div>
        <div style={{ color: '#ccc', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/">Conditions of Use & Sale</Link>
          <Link to="/">Privacy Notice</Link>
          <Link to="/">Interest-Based Ads</Link>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}>
          © 2026, FreshShop, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
}

export default Footer;
