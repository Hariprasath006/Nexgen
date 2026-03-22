import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function StaticInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  // Clean up the URL path (e.g., "/about-us" -> "about us")
  const pageName = location.pathname.split('/').pop().replace(/-/g, ' ');

  return (
    <>
      <Navbar cartCount={0} />
      <div className="container" style={{ padding: '60px 20px', minHeight: '60vh', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--primary)', marginBottom: '20px', textTransform: 'capitalize' }}>
          {pageName}
        </h1>
        <div style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚧</div>
          <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>Page Under Construction</h2>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '30px', fontSize: '15px' }}>
            We're currently working hard to bring you the best experience.<br/>
            The <strong><span style={{textTransform: 'capitalize'}}>{pageName}</span></strong> page will be launching very soon!
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')} 
            style={{ padding: '12px 28px', borderRadius: 'var(--radius-pill)', fontWeight: 'bold' }}
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StaticInfo;
