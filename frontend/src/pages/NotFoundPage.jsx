import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary-600)', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2rem' }}>
          The page or resource you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Home size={16} />
            <span>Go Home</span>
          </Link>
          <Link to="/dashboard" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <ArrowLeft size={16} />
            <span>Candidate Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
