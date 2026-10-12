import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient, { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  Compass, 
  Share2, 
  Send
} from 'lucide-react';
import SkillBadge from '../components/SkillBadge';
import MatchIndicator from '../components/MatchIndicator';
import Modal from '../components/Modal';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_candidate_profile');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILE;
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [job, setJob] = useState(() => {
    return INITIAL_DEMO_JOBS.find(j => j.id === parseInt(id)) || INITIAL_DEMO_JOBS[0];
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await apiClient.get(`/jobs/${id}`);
        if (res.data?.data) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.warn('Backend job fetch note, using local fallback:', err.message);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  // Match calculations
  const candidateSkillsLower = profile.skills.map(s => s.name.toLowerCase());
  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];

  const matchedRequired = requiredSkills.filter(s => candidateSkillsLower.includes(s.toLowerCase()));
  const missingRequired = requiredSkills.filter(s => !candidateSkillsLower.includes(s.toLowerCase()));
  const matchedPreferred = preferredSkills.filter(s => candidateSkillsLower.includes(s.toLowerCase()));

  const matchScore = requiredSkills.length > 0 
    ? Math.round((matchedRequired.length / requiredSkills.length) * 100) 
    : 0;

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsApplyModalOpen(false);

    // Save to tracked applications in localStorage
    const savedApps = JSON.parse(localStorage.getItem('jobskillmatch_applications') || '[]');
    const newApp = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      matchScore: matchScore
    };
    localStorage.setItem('jobskillmatch_applications', JSON.stringify([newApp, ...savedApps]));

    showToast(`Application submitted successfully for ${job.title}! Status: Applied.`, 'success');
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary btn-sm" 
          style={{ gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Jobs</span>
        </button>
      </div>

      {/* Hero Job Banner */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-demo">Simulated Job Record</span>
              <span className="badge badge-neutral">{job.employmentType}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              {job.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
              <Building2 size={18} color="var(--primary-600)" />
              <span style={{ fontWeight: 600 }}>{job.company}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MatchIndicator score={matchScore} size="large" />
            <button
              onClick={() => {
                setIsSaved(!isSaved);
                showToast(isSaved ? 'Job removed from bookmarks' : 'Job saved to bookmarks', 'info');
              }}
              className="btn btn-secondary"
              style={{ padding: '0.65rem' }}
              title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
            >
              {isSaved ? <BookmarkCheck size={20} color="var(--primary-600)" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          fontSize: '0.875rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Location</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginTop: '0.2rem' }}>
              <MapPin size={15} color="var(--primary-600)" />
              <span>{job.location}</span>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Salary Range</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--success-700)' }}>
              <DollarSign size={15} />
              <span>{job.salaryRange || 'Competitive'}</span>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Experience Required</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginTop: '0.2rem' }}>
              <Briefcase size={15} />
              <span>{job.minExperience} - {job.maxExperience} Years</span>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Posted On</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginTop: '0.2rem' }}>
              <Calendar size={15} />
              <span>{job.postedDate}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          disabled={isSubmitted}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isSubmitted ? 'Already Applied' : 'Apply for this Position (Demo Workflow)'}
        </button>
      </div>

      {/* Match Compatibility Deep Dive Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} color="var(--primary-600)" />
          <span>Algorithm Match Breakdown</span>
        </h3>

        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: matchScore >= 70 ? 'var(--success-50)' : 'var(--warning-50)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${matchScore >= 70 ? 'var(--success-100)' : 'var(--warning-100)'}`,
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: matchScore >= 70 ? 'var(--success-700)' : 'var(--warning-700)'
        }}>
          <strong>Compatibility Assessment: </strong>
          {matchScore >= 70 
            ? `Strong match! You possess ${matchedRequired.length} of the ${requiredSkills.length} required technical skills.`
            : `Moderate match. You meet ${matchedRequired.length} of ${requiredSkills.length} core requirements. We recommend reviewing the missing skills below.`}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Matched Skills */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <CheckCircle2 size={16} />
              <span>Matched Required Skills ({matchedRequired.length})</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {matchedRequired.map(s => (
                <SkillBadge key={s} name={s} type="matched" />
              ))}
              {matchedRequired.length === 0 && (
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>None matched yet</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--danger-600)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <XCircle size={16} />
              <span>Missing Required Skills ({missingRequired.length})</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {missingRequired.map(s => (
                <SkillBadge key={s} name={s} type="missing" />
              ))}
              {missingRequired.length === 0 && (
                <span style={{ fontSize: '0.825rem', color: 'var(--success-600)' }}>All required skills matched!</span>
              )}
            </div>

            {missingRequired.length > 0 && (
              <Link to="/skill-gap" className="btn btn-outline-primary btn-sm" style={{ gap: '0.35rem' }}>
                <Compass size={14} />
                <span>Bridge Missing Skills in Gap Analyzer</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Job Description & Requirements */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Role Description &amp; Responsibilities</h3>
        <p style={{ color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {job.description}
        </p>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Academic &amp; Degree Requirements</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', marginBottom: '2rem', fontSize: '0.925rem' }}>
          <GraduationCap size={18} color="var(--violet-600)" />
          <span>{job.educationRequirement}</span>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Nice-to-Have / Preferred Skills</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {preferredSkills.map(s => (
            <span key={s} className="badge badge-primary">{s}</span>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        title={`Apply to ${job.company}`}
      >
        <form onSubmit={handleApplySubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You are submitting a demonstration application for <strong>{job.title}</strong>. Your cataloged profile details will be submitted to the demo employer.
            </p>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Applicant: {profile.fullName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: {profile.email} &bull; Phone: {profile.phone}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', marginTop: '0.25rem', fontWeight: 600 }}>Algorithm Match Score: {matchScore}%</div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Note / Remarks (Optional)</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                placeholder="Share a brief message highlighting your projects and why you're a fit..." 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={() => setIsApplyModalOpen(false)} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Send size={16} />
              <span>Submit Demo Application</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetailsPage;
