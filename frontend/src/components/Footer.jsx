import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, Database } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                JobSkill<span style={{ color: 'var(--primary-600)' }}>Match</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              AI-Powered career intelligence portal aligning candidate skills with real market demand and structured learning roadmaps.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <span className="badge badge-neutral" style={{ gap: '0.3rem' }}><Code2 size={13} /> React + Spring Boot</span>
              <span className="badge badge-neutral" style={{ gap: '0.3rem' }}><Database size={13} /> MySQL 8</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-dark)' }}>
              Candidate Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/jobs">Job Discovery</Link></li>
              <li><Link to="/recommended">AI Job Match Engine</Link></li>
              <li><Link to="/skill-gap">Skill Gap Analyzer</Link></li>
              <li><Link to="/roadmap">Career Learning Roadmap</Link></li>
              <li><Link to="/resume">Resume Analyzer & Parser</Link></li>
            </ul>
          </div>

          {/* Architecture info */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-dark)' }}>
              System Highlights
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>Normalized Skill Match Scoring</li>
              <li>Spring Security + JWT Bearer Auth</li>
              <li>Dual-Deployment (Vercel &amp; Render)</li>
              <li>Role-Based Access (Candidate &amp; Admin)</li>
              <li>Flyway Database Migrations</li>
            </ul>
          </div>

          {/* Demonstration note */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-dark)' }}>
              Academic Portfolio
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)'
            }}>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Demonstration Notice</p>
              JobSkillMatch is built as a complete full-stack portfolio application. Job listings, matching scores, and metrics reflect database-backed demonstration records.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          gap: '1rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} JobSkillMatch Portal. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
