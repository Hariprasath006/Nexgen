import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiTool, FiArrowLeft } from 'react-icons/fi';

function StaticInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.split('/').pop().replace(/-/g, ' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar cartCount={0} />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ 
          background: 'white', 
          padding: '50px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)', 
          maxWidth: '650px', 
          width: '100%',
          textAlign: 'center',
          border: '1px solid #f1f5f9'
        }}>
          
          <div style={{ 
            width: '96px', 
            height: '96px', 
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)', 
            borderRadius: '28px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 10px 25px rgba(2, 44, 34, 0.2)',
            transform: 'rotate(-5deg)'
          }}>
            <FiTool size={48} color="white" style={{ transform: 'rotate(5deg)' }} />
          </div>

          <h1 style={{ 
            fontSize: '36px', 
            color: 'var(--text-dark)', 
            marginBottom: '15px', 
            textTransform: 'capitalize',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            {pageName}
          </h1>
          
          <div style={{ 
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: '#fffbeb',
            color: '#d97706',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '25px',
            border: '1px solid #fef3c7'
          }}>
            Page under construction
          </div>

          <p style={{ 
            color: 'var(--text-light)', 
            lineHeight: '1.7', 
            marginBottom: '40px', 
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto 40px'
          }}>
            We're currently designing the <strong><span style={{textTransform: 'capitalize'}}>{pageName}</span></strong> experience. 
            Our team is working hard to bring you this new feature. Check back soon for updates!
          </p>

          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '16px 32px', 
              borderRadius: '12px', 
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(2, 44, 34, 0.15)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FiArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default StaticInfo;
