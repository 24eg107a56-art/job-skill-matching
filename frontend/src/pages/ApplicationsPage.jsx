import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Bookmark, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink,
  Trash2,
  Briefcase
} from 'lucide-react';
import MatchIndicator from '../components/MatchIndicator';

const DEFAULT_APPLICATIONS = [
  {
    id: 101,
    jobId: 1,
    jobTitle: 'Java Backend Developer',
    company: 'Apex Cloud Solutions',
    location: 'Bangalore, India (Hybrid)',
    appliedDate: '2026-10-08',
    status: 'In Review',
    matchScore: 85
  },
  {
    id: 102,
    jobId: 3,
    jobTitle: 'Full-Stack Software Engineer',
    company: 'Nexus FinTech',
    location: 'Hyderabad, India (On-site)',
    appliedDate: '2026-10-10',
    status: 'Applied',
    matchScore: 90
  }
];

const ApplicationsPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'saved'

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_applications');
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS;
  });

  const [savedJobIds, setSavedJobIds] = useState([1, 2, 4]);

  const savedJobs = INITIAL_DEMO_JOBS.filter(j => savedJobIds.includes(j.id));

  const handleStatusChange = (appId, newStatus) => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem('jobskillmatch_applications', JSON.stringify(updated));
    showToast(`Application status updated to "${newStatus}"`, 'success');
  };

  const handleRemoveApplication = (appId) => {
    const updated = applications.filter(a => a.id !== appId);
    setApplications(updated);
    localStorage.setItem('jobskillmatch_applications', JSON.stringify(updated));
    showToast('Application record removed', 'info');
  };

  const handleRemoveSavedJob = (jobId) => {
    const updated = savedJobIds.filter(id => id !== jobId);
    setSavedJobIds(updated);
    showToast('Removed from saved bookmarks', 'info');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Offer': return 'badge-matched';
      case 'Interview': return 'badge-primary';
      case 'In Review': return 'badge-demo';
      case 'Rejected': return 'badge-missing';
      default: return 'badge-neutral';
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Applications &amp; Bookmarks</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Track the status of jobs you have applied to and manage bookmarked listings.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'applications' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'applications' ? '3px solid var(--primary-600)' : '3px solid transparent',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Send size={16} />
          <span>Tracked Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'saved' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'saved' ? '3px solid var(--primary-600)' : '3px solid transparent',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Bookmark size={16} />
          <span>Saved Jobs ({savedJobs.length})</span>
        </button>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {applications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Send size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Applications Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                You haven't submitted any job applications yet. Explore matched jobs to begin.
              </p>
              <Link to="/recommended" className="btn btn-primary btn-sm">
                Explore Matched Jobs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {applications.map((app) => (
                <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', padding: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Applied on {app.appliedDate}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {app.jobTitle}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building2 size={14} color="var(--primary-600)" />
                        <span style={{ fontWeight: 600 }}>{app.company}</span>
                      </div>
                      <span>&bull;</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} />
                        <span>{app.location}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <MatchIndicator score={app.matchScore} />

                    {/* Status updater dropdown */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        Update Status:
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="In Review">In Review</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleRemoveApplication(app.id)}
                      style={{ background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', padding: '0.25rem' }}
                      title="Remove record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Bookmark size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Saved Jobs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Bookmark jobs as you browse to save them for quick application later.
              </p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {savedJobs.map((job) => (
                <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-demo">Saved Role</span>
                      <button
                        onClick={() => handleRemoveSavedJob(job.id)}
                        style={{ background: 'transparent', color: 'var(--text-light)', cursor: 'pointer' }}
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>{job.company}</p>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                      Location: {job.location} &bull; Salary: {job.salaryRange}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                    <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
