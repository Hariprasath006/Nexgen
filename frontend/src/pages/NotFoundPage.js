import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <FiAlertTriangle size={80} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
          404 - Page Not Found
        </h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          We can't seem to find the page you're looking for.
        </p>
        <Link to="/" style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontWeight: '600',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          Return to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
