import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Compass, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import SkillBadge from '../components/SkillBadge';
import MatchIndicator from '../components/MatchIndicator';

const SkillGapPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState(INITIAL_DEMO_JOBS);
  const [profile] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_candidate_profile');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILE;
  });

  const [selectedJobId, setSelectedJobId] = useState(INITIAL_DEMO_JOBS[0].id);
  const [serverGap, setServerGap] = useState(null);

  // Load available jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/jobs');
        if (res.data?.data && res.data.data.length > 0) {
          setJobs(res.data.data);
          setSelectedJobId(res.data.data[0].id);
        }
      } catch (err) {
        console.warn('Jobs fetch fallback in gap analysis:', err.message);
      }
    };
    fetchJobs();
  }, []);

  // Fetch precision skill gap analysis for selected job
  useEffect(() => {
    const fetchGap = async () => {
      try {
        const res = await apiClient.get(`/matching/gap/${selectedJobId}`);
        if (res.data?.data) {
          setServerGap(res.data.data);
        }
      } catch (err) {
        setServerGap(null);
      }
    };
    if (selectedJobId) {
      fetchGap();
    }
  }, [selectedJobId]);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const candidateSkillsLower = profile.skills.map(s => s.name.toLowerCase());
  const required = selectedJob.requiredSkills || [];

  const matchedSkills = serverGap ? serverGap.matchedSkills : required.filter(s => candidateSkillsLower.includes(s.toLowerCase()));
  const missingSkills = serverGap 
    ? serverGap.missingSkills.map(m => m.skill)
    : required.filter(s => !candidateSkillsLower.includes(s.toLowerCase()));

  const matchPercentage = serverGap ? serverGap.matchPercentage : (required.length > 0 
    ? Math.round((matchedSkills.length / required.length) * 100) 
    : 0);

  // Metadata for missing skills
  const skillMeta = {
    'Docker': { priority: 'High', difficulty: 'Moderate', duration: '2 Weeks', resource: 'https://docs.docker.com/get-started/', resourceName: 'Official Docker Documentation' },
    'AWS': { priority: 'High', difficulty: 'Challenging', duration: '4 Weeks', resource: 'https://aws.amazon.com/training/', resourceName: 'AWS Skill Builder Official' },
    'Microservices': { priority: 'Medium', difficulty: 'Moderate', duration: '3 Weeks', resource: 'https://spring.io/guides', resourceName: 'Spring Microservices Guides' },
    'Kafka': { priority: 'Medium', difficulty: 'Challenging', duration: '3 Weeks', resource: 'https://kafka.apache.org/documentation/', resourceName: 'Apache Kafka Quickstart' },
    'Kubernetes': { priority: 'High', difficulty: 'Challenging', duration: '4 Weeks', resource: 'https://kubernetes.io/docs/tutorials/', resourceName: 'Kubernetes Official Tutorials' },
    'Linux': { priority: 'Medium', difficulty: 'Easy', duration: '1 Week', resource: 'https://ubuntu.com/tutorials', resourceName: 'Ubuntu Linux Fundamentals' },
    'FastAPI': { priority: 'Medium', difficulty: 'Easy', duration: '1.5 Weeks', resource: 'https://fastapi.tiangolo.com/tutorial/', resourceName: 'FastAPI Interactive Tutorial' },
    'TensorFlow': { priority: 'High', difficulty: 'Challenging', duration: '5 Weeks', resource: 'https://www.tensorflow.org/tutorials', resourceName: 'TensorFlow Core Tutorials' },
    'Machine Learning': { priority: 'High', difficulty: 'Challenging', duration: '6 Weeks', resource: 'https://developers.google.com/machine-learning/crash-course', resourceName: 'Google Machine Learning Crash Course' }
  };

  const handleGenerateRoadmap = () => {
    // Generate and persist custom roadmap for this role
    const roadmapItems = missingSkills.map((skill, index) => {
      const meta = skillMeta[skill] || {
        priority: 'Medium',
        difficulty: 'Moderate',
        duration: '2 Weeks',
        resource: 'https://developer.mozilla.org',
        resourceName: 'MDN Web Docs'
      };

      return {
        id: index + 1,
        skill,
        targetRole: selectedJob.title,
        priority: meta.priority,
        duration: meta.duration,
        resource: meta.resource,
        resourceName: meta.resourceName,
        completed: false
      };
    });

    localStorage.setItem('jobskillmatch_custom_roadmap', JSON.stringify({
      targetRole: selectedJob.title,
      items: roadmapItems
    }));

    showToast(`Career roadmap generated for ${selectedJob.title}!`, 'success');
    navigate('/roadmap');
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Skill Gap Analyzer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Compare your current technical profile against market requirements to identify missing skills and prepare a learning plan.
        </p>
      </div>

      {/* Target Role Selector Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <label className="form-label" style={{ fontSize: '0.95rem' }}>Select Target Career Position to Evaluate:</label>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
            style={{ flex: 1, minWidth: '260px', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 600 }}
          >
            {INITIAL_DEMO_JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} &mdash; {j.company} ({j.location})
              </option>
            ))}
          </select>

          <MatchIndicator score={matchPercentage} size="large" />
        </div>
      </div>

      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Matched Skills Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success-700)' }}>
            <CheckCircle2 size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Matched Skills ({matchedSkills.length})</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Technologies required for this role that you already possess in your verified profile.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {matchedSkills.map((s) => (
              <SkillBadge key={s} name={s} type="matched" />
            ))}
            {matchedSkills.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No required skills matched yet. Review the missing skills below.
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger-600)' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Identified Skill Gaps ({missingSkills.length})</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            High-demand skills required by employers that are currently missing from your profile.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {missingSkills.map((s) => (
              <SkillBadge key={s} name={s} type="missing" />
            ))}
            {missingSkills.length === 0 && (
              <div style={{ color: 'var(--success-600)', fontSize: '0.85rem', fontWeight: 600 }}>
                Zero skill gaps! You meet 100% of this role's required skill set.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prioritized Learning Action Plan Table */}
      {missingSkills.length > 0 && (
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recommended Learning Action Plan</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Prioritized by market importance with official documentation and free learning references.
              </p>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <BookOpen size={16} />
              <span>Generate Roadmap for this Role</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Skill to Master</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Difficulty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Est. Duration</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Free Learning Resource</th>
                </tr>
              </thead>
              <tbody>
                {missingSkills.map((skill) => {
                  const meta = skillMeta[skill] || {
                    priority: 'Medium',
                    difficulty: 'Moderate',
                    duration: '2-3 Weeks',
                    resource: 'https://developer.mozilla.org',
                    resourceName: 'MDN Web Resources'
                  };

                  return (
                    <tr key={skill} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {skill}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span className={`badge ${meta.priority === 'High' ? 'badge-missing' : 'badge-neutral'}`}>
                          {meta.priority}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-body)' }}>
                        {meta.difficulty}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} />
                          <span>{meta.duration}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <a
                          href={meta.resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-600)', fontWeight: 600 }}
                        >
                          <span>{meta.resourceName}</span>
                          <ExternalLink size={13} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapPage;
