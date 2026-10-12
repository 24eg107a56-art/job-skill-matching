import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchIndicator from './MatchIndicator';
import { useToast } from '../context/ToastContext';

const JobCard = ({ job, candidateSkills = [], onApply, isSavedInitial = false }) => {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isApplied, setIsApplied] = useState(false);

  // Normalize skill arrays for comparison
  const candidateSkillNames = candidateSkills.map(s => 
    typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()
  );

  const requiredSkills = job.requiredSkills || [];
  
  // Calculate match percentage: (matched / total) * 100
  const matchedSkills = requiredSkills.filter(s => 
    candidateSkillNames.includes(s.toLowerCase())
  );
  const missingSkills = requiredSkills.filter(s => 
    !candidateSkillNames.includes(s.toLowerCase())
  );

  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    showToast(isSaved ? `Removed "${job.title}" from saved jobs` : `Saved "${job.title}" to your bookmarks`, 'info');
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else {
      setIsApplied(true);
      showToast(`Application submitted successfully for ${job.title} at ${job.company}!`, 'success');
    }
  };

  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.25rem',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-demo">Demo Listing</span>
              {job.employmentType && (
                <span className="badge badge-neutral">{job.employmentType}</span>
              )}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              {job.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              <Building2 size={15} />
              <span style={{ fontWeight: 600 }}>{job.company}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MatchIndicator score={matchPercentage} />
            <button
              onClick={handleToggleSave}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSaved ? 'var(--primary-600)' : 'var(--text-light)',
                padding: '0.25rem',
                cursor: 'pointer'
              }}
              title={isSaved ? 'Remove bookmark' : 'Save job'}
              aria-label="Bookmark job"
            >
              {isSaved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
            </button>
          </div>
        </div>

        {/* Location & Salary Info */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          margin: '0.75rem 0',
          padding: '0.65rem 0',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--primary-600)" />
            <span>{job.location}</span>
          </div>
          {job.salaryRange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={14} color="var(--success-600)" />
              <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{job.salaryRange}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} />
            <span>Exp: {job.minExperience} - {job.maxExperience} yrs</span>
          </div>
        </div>

        {/* Job Brief Description */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-body)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          {job.description}
        </p>

        {/* Skills Tag Cloud */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
            Required Skills ({matchedSkills.length}/{requiredSkills.length} Matched)
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {requiredSkills.map((skill) => {
              const isMatched = candidateSkillNames.includes(skill.toLowerCase());
              return (
                <SkillBadge 
                  key={skill} 
                  name={skill} 
                  type={isMatched ? 'matched' : 'missing'} 
                  size="small" 
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)',
        marginTop: 'auto'
      }}>
        <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>

        <button 
          onClick={handleApplyClick}
          disabled={isApplied}
          className={`btn btn-sm ${isApplied ? 'btn-secondary' : 'btn-primary'}`}
          style={{ gap: '0.4rem' }}
        >
          {isApplied ? (
            <>
              <CheckCircle2 size={15} color="var(--success-600)" />
              <span>Applied</span>
            </>
          ) : (
            'Easy Apply (Demo)'
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
