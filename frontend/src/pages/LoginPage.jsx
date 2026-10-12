import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, Lock, LogIn, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      if (result.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCandidateLogin = async () => {
    setEmail('arun.candidate@example.com');
    setPassword('CandidatePass@123');
    setLoading(true);
    const result = await login('arun.candidate@example.com', 'CandidatePass@123', 'ROLE_CANDIDATE');
    showToast('Signed in with Demo Candidate account!', 'success');
    navigate('/dashboard');
    setLoading(false);
  };

  const handleDemoAdminLogin = async () => {
    setEmail('admin@jobskillmatch.com');
    setPassword('AdminSecure@123');
    setLoading(true);
    const result = await login('admin@jobskillmatch.com', 'AdminSecure@123', 'ROLE_ADMIN');
    showToast('Signed in with Demo Administrator account!', 'success');
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-primary)',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sign in to access your matched jobs and learning roadmaps
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-light)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            Instant Demo Sign In (1-Click Test)
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handleDemoCandidateLogin}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <User size={14} color="var(--primary-600)" />
              Candidate
            </button>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} color="var(--violet-600)" />
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--danger-50)',
            color: 'var(--danger-600)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--danger-100)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-600)', cursor: 'pointer' }}>Forgot password?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            <LogIn size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
