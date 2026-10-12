import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  Briefcase, 
  Target, 
  Compass, 
  BookOpen, 
  BookmarkCheck, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: UserCheck },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Discover Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Matched Jobs', path: '/recommended', icon: Target },
    { name: 'Skill Gap Analyzer', path: '/skill-gap', icon: Compass },
    { name: 'Career Roadmap', path: '/roadmap', icon: BookOpen },
    { name: 'Applications & Saved', path: '/applications', icon: BookmarkCheck },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Management', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: 'calc(100vh - 72px)'
    }}>
      {/* User Header in Sidebar */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: isAdmin ? 'var(--violet-500)' : 'var(--primary-600)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'Candidate User'}
          </h4>
          <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-matched'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            {isAdmin ? 'Administrator' : 'Job Seeker'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary-600)' : 'var(--text-body)',
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Mini Profile Completion Card in Sidebar */}
      <div style={{
        padding: '1.25rem',
        margin: '1rem',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)' }}>Profile Strength</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)' }}>85%</span>
        </div>
        <div className="progress-container" style={{ height: '6px', marginBottom: '0.5rem' }}>
          <div className="progress-bar" style={{ width: '85%' }}></div>
        </div>
        <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          Add your latest certifications to reach 100% profile score.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
