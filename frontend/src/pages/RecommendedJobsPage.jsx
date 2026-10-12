import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { 
  Target, 
  Sparkles, 
  Compass, 
  Building2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import SkillBadge from '../components/SkillBadge';
import MatchIndicator from '../components/MatchIndicator';

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState(INITIAL_DEMO_JOBS);
  const [profile] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_candidate_profile');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILE;
  });

  const [filterTier, setFilterTier] = useState('All');

  // Load server-calculated recommendations if available
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await apiClient.get('/matching/recommendations');
        if (res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map(item => ({
            ...item.job,
            matchScore: item.matchPercentage,
            matchedRequired: item.matchedSkills,
            missingRequired: item.missingSkills,
            matchedPreferred: item.preferredSkillsMatched || [],
            isApplied: item.applied,
            isSaved: item.saved
          }));
          setJobs(mapped);
        }
      } catch (err) {
        console.warn('Backend recommendations note, using local engine:', err.message);
      }
    };
    fetchRecommendations();
  }, []);

  const candidateSkillsLower = profile.skills.map(s => s.name.toLowerCase());

  // Rank jobs based on normalized skill matching formula
  const rankedJobs = useMemo(() => {
    return jobs.map(job => {
      const required = job.requiredSkills || [];
      const preferred = job.preferredSkills || [];

      const matchedRequired = required.filter(s => candidateSkillsLower.includes(s.toLowerCase()));
      const missingRequired = required.filter(s => !candidateSkillsLower.includes(s.toLowerCase()));

      const skillScore = required.length > 0 
        ? (matchedRequired.length / required.length) * 100 
        : 0;

      // Bonus points for matching preferred skills and experience
      const expMatch = profile.yearsOfExperience >= job.minExperience;
      const finalScore = Math.min(100, Math.round(skillScore + (expMatch ? 5 : 0)));

      // Recommendation reasoning
      let reason = 'High skill overlap with your background.';
      if (missingRequired.length === 0) {
        reason = 'Exceptional fit! You have 100% of the core required skills.';
      } else if (missingRequired.length <= 2) {
        reason = `Great match! You only need to learn ${missingRequired.join(', ')} to be fully qualified.`;
      } else {
        reason = 'Moderate match. Good stretch opportunity to expand into new frameworks.';
      }

      return {
        ...job,
        matchScore: finalScore,
        matchedRequired,
        missingRequired,
        expMatch,
        reason
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, profile]);

  const filteredRankedJobs = rankedJobs.filter(job => {
    if (filterTier === 'High') return job.matchScore >= 75;
    if (filterTier === 'Medium') return job.matchScore >= 50 && job.matchScore < 75;
    if (filterTier === 'Low') return job.matchScore < 50;
    return true;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <Sparkles size={14} />
          <span>Transparent Rule-Based Scoring Formula</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>AI Job Match Recommendations</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Every score is calculated using exact mathematical matching: (Candidate Possessed Skills / Required Skills) &times; 100.
        </p>
      </div>

      {/* Filter Tiers */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All', 'High', 'Medium', 'Low'].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`btn btn-sm ${filterTier === tier ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tier === 'All' && 'All Recommendations'}
            {tier === 'High' && 'High Match (75%+)'}
            {tier === 'Medium' && 'Moderate Match (50% - 74%)'}
            {tier === 'Low' && 'Stretch Roles (<50%)'}
          </button>
        ))}
      </div>

      {/* List of Recommended Jobs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredRankedJobs.map((item, index) => (
          <div key={item.id} className="card card-interactive" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-demo">Rank #{index + 1}</span>
                  <span className="badge badge-neutral">{item.employmentType}</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {item.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                    <Building2 size={15} color="var(--primary-600)" />
                    <span>{item.company}</span>
                  </div>
                  <span>&bull;</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <MatchIndicator score={item.matchScore} size="large" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Formula: {item.matchedRequired.length} / {item.requiredSkills.length} skills
                </span>
              </div>
            </div>

            {/* Recommendation Reasoning Callout */}
            <div style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--primary-600)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-body)'
            }}>
              <strong>Why Recommended:</strong> {item.reason}
            </div>

            {/* Detailed Skills Comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-700)', display: 'block', marginBottom: '0.5rem' }}>
                  Matched Skills ({item.matchedRequired.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {item.matchedRequired.map(s => (
                    <SkillBadge key={s} name={s} type="matched" size="small" />
                  ))}
                  {item.matchedRequired.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger-600)', display: 'block', marginBottom: '0.5rem' }}>
                  Missing Skills ({item.missingRequired.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {item.missingRequired.map(s => (
                    <SkillBadge key={s} name={s} type="missing" size="small" />
                  ))}
                  {item.missingRequired.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--success-600)', fontWeight: 600 }}>All requirements satisfied!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={15} />
                <span>Requires: {item.educationRequirement}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {item.missingRequired.length > 0 && (
                  <Link to="/skill-gap" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
                    <Compass size={14} color="var(--primary-600)" />
                    <span>View Gap Analysis</span>
                  </Link>
                )}
                <Link to={`/jobs/${item.id}`} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                  <span>View Details &amp; Apply</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobsPage;
