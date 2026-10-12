import React, { useState, useMemo, useEffect } from 'react';
import apiClient, { INITIAL_DEMO_JOBS, INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { Search, MapPin, Filter, Briefcase, RefreshCw, X } from 'lucide-react';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const [jobs, setJobs] = useState(INITIAL_DEMO_JOBS);
  const [profile] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_candidate_profile');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILE;
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/jobs');
        if (res.data?.data && res.data.data.length > 0) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.warn('Backend jobs fetch note, using cached jobs:', err.message);
      }
    };
    fetchJobs();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Extract unique filter options
  const uniqueLocations = ['All', ...new Set(jobs.map(j => j.location.split('(')[0].trim()))];
  const uniqueSkills = ['All', 'Java', 'Spring Boot', 'React', 'Python', 'SQL', 'Docker', 'AWS', 'Git'];

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    const candidateSkillsLower = profile.skills.map(s => s.name.toLowerCase());

    return jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = locationFilter === 'All' || job.location.includes(locationFilter);
      const matchesType = typeFilter === 'All' || job.employmentType === typeFilter;
      const matchesSkill = selectedSkill === 'All' || job.requiredSkills.some(s => s.toLowerCase() === selectedSkill.toLowerCase());

      return matchesSearch && matchesLocation && matchesType && matchesSkill;
    }).map((job) => {
      // Calculate match score
      const req = job.requiredSkills || [];
      const matched = req.filter(s => candidateSkillsLower.includes(s.toLowerCase()));
      const score = req.length > 0 ? Math.round((matched.length / req.length) * 100) : 0;
      return { ...job, matchScore: score };
    }).sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }, [jobs, profile, searchQuery, locationFilter, typeFilter, selectedSkill, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setLocationFilter('All');
    setTypeFilter('All');
    setSelectedSkill('All');
    setSortBy('match');
    setCurrentPage(1);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Job Opportunities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Browse verified market positions. Match scores reflect alignment with your cataloged skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by title, company, keyword..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>

          {/* Location Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2.5rem' }}
            >
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>Location: {loc}</option>
              ))}
            </select>
            <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>

          {/* Skill Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={selectedSkill}
              onChange={(e) => { setSelectedSkill(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2.5rem' }}
            >
              {uniqueSkills.map(s => (
                <option key={s} value={s}>Skill: {s}</option>
              ))}
            </select>
            <Filter size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>

          {/* Sort By */}
          <div>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">Sort by: Highest Match</option>
              <option value="date">Sort by: Newest First</option>
              <option value="title">Sort by: Job Title</option>
            </select>
          </div>
        </div>

        {/* Results Info & Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Showing <strong>{filteredJobs.length}</strong> matching positions</span>
          {(searchQuery || locationFilter !== 'All' || selectedSkill !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={resetFilters}
              style={{ background: 'transparent', color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
            >
              <X size={14} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {currentJobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Briefcase size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Jobs Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            No listings matched your criteria. Try adjusting your search query or reset filters.
          </p>
          <button onClick={resetFilters} className="btn btn-secondary btn-sm">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} candidateSkills={profile.skills} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`btn btn-sm ${currentPage === num ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '36px' }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
