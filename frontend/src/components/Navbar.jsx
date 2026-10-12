import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  Briefcase, 
  Compass, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Target
} from 'lucide-react';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully', 'info');
    navigate('/login');
  };

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'ROLE_CANDIDATE' : 'ROLE_ADMIN';
    switchRole(nextRole);
    showToast(`Switched view to ${nextRole === 'ROLE_ADMIN' ? 'Administrator' : 'Candidate'}`, 'success');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="glass navbar-height" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-light)',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div className="container flex-between" style={{ height: '100%' }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-primary)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
                JobSkill<span style={{ color: 'var(--primary-600)' }}>Match</span>
              </span>
              <span className="badge badge-demo" style={{ marginLeft: '0.5rem' }}>Demo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <Link to="/jobs" style={{ 
              fontWeight: 600, 
              fontSize: '0.925rem',
              color: isActive('/jobs') ? 'var(--primary-600)' : 'var(--text-body)' 
            }}>
              Explore Jobs
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/recommended" style={{ 
                  fontWeight: 600, 
                  fontSize: '0.925rem',
                  color: isActive('/recommended') ? 'var(--primary-600)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Target size={16} /> Matches
                </Link>

                <Link to="/skill-gap" style={{ 
                  fontWeight: 600, 
                  fontSize: '0.925rem',
                  color: isActive('/skill-gap') ? 'var(--primary-600)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Compass size={16} /> Skill Gaps
                </Link>

                <Link to="/roadmap" style={{ 
                  fontWeight: 600, 
                  fontSize: '0.925rem',
                  color: isActive('/roadmap') ? 'var(--primary-600)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <BookOpen size={16} /> Roadmap
                </Link>
              </>
            )}

            {/* Role Switcher Pill for Testing */}
            {isLoggedIn && (
              <button 
                onClick={handleRoleToggle}
                className="btn btn-secondary btn-sm"
                title="Click to toggle between Candidate and Admin roles for testing"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <ShieldCheck size={14} color="var(--primary-600)" />
                Role: {isAdmin ? 'Admin' : 'Candidate'}
              </button>
            )}
          </nav>

          {/* Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                  <User size={15} />
                  <span>{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ color: 'var(--danger-600)' }}>
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', display: 'none' }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-light)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Explore Jobs</Link>
            {isLoggedIn && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Candidate Dashboard</Link>
                <Link to="/recommended" onClick={() => setMobileMenuOpen(false)}>Job Recommendations</Link>
                <Link to="/skill-gap" onClick={() => setMobileMenuOpen(false)}>Skill Gap Analyzer</Link>
                <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)}>Career Roadmap</Link>
                <Link to="/resume" onClick={() => setMobileMenuOpen(false)}>Resume Analyzer</Link>
                <Link to="/applications" onClick={() => setMobileMenuOpen(false)}>Application Tracker</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
              </>
            )}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
