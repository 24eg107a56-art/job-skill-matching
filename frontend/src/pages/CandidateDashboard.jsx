import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { 
  Target, 
  Briefcase, 
  Compass, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import JobCard from '../components/JobCard';
import MatchIndicator from '../components/MatchIndicator';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile] = useState(INITIAL_CANDIDATE_PROFILE);
  const [jobs] = useState(INITIAL_DEMO_JOBS);

  // Skill match chart data
  const skillChartData = [
    { skill: 'Java', proficiency: 90, marketDemand: 95 },
    { skill: 'Spring Boot', proficiency: 75, marketDemand: 90 },
    { skill: 'React', proficiency: 70, marketDemand: 85 },
    { skill: 'MySQL', proficiency: 80, marketDemand: 80 },
    { skill: 'Docker', proficiency: 30, marketDemand: 75 },
    { skill: 'AWS Cloud', proficiency: 25, marketDemand: 80 },
  ];

  // Best matches calculation
  const candidateSkills = profile.skills.map(s => s.name.toLowerCase());
  const evaluatedJobs = jobs.map(job => {
    const req = job.requiredSkills || [];
    const matched = req.filter(s => candidateSkills.includes(s.toLowerCase()));
    const score = req.length > 0 ? Math.round((matched.length / req.length) * 100) : 0;
    return { ...job, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = evaluatedJobs.slice(0, 3);
  const avgMatchScore = Math.round(
    evaluatedJobs.slice(0, 5).reduce((acc, j) => acc + j.matchScore, 0) / 5
  );

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, var(--primary-900) 100%)',
        color: '#FFFFFF',
        marginBottom: '2rem',
        padding: '2rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#FDE047" />
            <span>AI Match Engine Active</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || profile.fullName}!
          </h1>
          <p style={{ color: 'var(--primary-200)', fontSize: '0.95rem' }}>
            Your profile matches <strong style={{ color: '#FFFFFF' }}>{evaluatedJobs.filter(j => j.matchScore >= 70).length} high-compatibility</strong> tech roles today. Review missing skills and follow your personalized roadmap.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/recommended" className="btn btn-primary" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary-900)', fontWeight: 700 }}>
            <Target size={16} />
            <span>View All Matches</span>
          </Link>
          <Link to="/resume" className="btn btn-secondary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <FileText size={16} />
            <span>Update Resume</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Match Score</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>{avgMatchScore}%</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-50)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recommended Roles</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>{evaluatedJobs.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Identified Skill Gaps</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>3 Skills</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', color: 'var(--violet-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Roadmap Completion</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>60%</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Profile Checklist */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Skill Proficiency vs Market Demand Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skill Competency vs Market Demand</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Comparison of your verified skills against industry benchmarks</p>
            </div>
            <Link to="/skill-gap" className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
              <span>Analyze Gaps</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={skillChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="skill" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value, name) => [
                    `${value}%`,
                    name === 'proficiency' ? 'Your Proficiency' : 'Market Demand'
                  ]}
                />
                <Bar dataKey="proficiency" fill="var(--primary-600)" radius={[4, 4, 0, 0]} name="Your Level" />
                <Bar dataKey="marketDemand" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Market Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile Strength & Missing Information Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Profile Strength</h3>
              <span className="badge badge-matched">85% Complete</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Complete all fields to boost matching accuracy by up to 25%.
            </p>

            <div className="progress-container" style={{ height: '8px', marginBottom: '1.5rem' }}>
              <div className="progress-bar" style={{ width: '85%' }}></div>
            </div>

            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.65rem' }}>
              Recommended Next Actions:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-600)' }}>
                <CheckCircle2 size={16} />
                <span>Resume parsed &amp; verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-600)' }}>
                <CheckCircle2 size={16} />
                <span>8 Technical skills cataloged</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-600)' }}>
                <AlertCircle size={16} />
                <span>Complete Docker milestone in roadmap</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span>Add GitHub project portfolio links</span>
              </div>
            </div>
          </div>

          <Link to="/profile" className="btn btn-outline-primary btn-sm" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Edit Full Profile
          </Link>
        </div>
      </div>

      {/* Top Matched Jobs Showcase */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Top Job Matches for You</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sorted by algorithm compatibility with your current skills</p>
          </div>
          <Link to="/recommended" className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {topMatches.map((job) => (
            <JobCard key={job.id} job={job} candidateSkills={profile.skills} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
