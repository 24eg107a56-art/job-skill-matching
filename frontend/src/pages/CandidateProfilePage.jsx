import React, { useState, useEffect } from 'react';
import apiClient, { INITIAL_CANDIDATE_PROFILE } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  Calendar, 
  Briefcase, 
  Award, 
  MapPin, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import SkillBadge from '../components/SkillBadge';

const CandidateProfilePage = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('jobskillmatch_candidate_profile');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILE;
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch candidate profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/profile');
        if (res.data?.data) {
          const d = res.data.data;
          const formatted = {
            fullName: d.name || profile.fullName,
            email: d.email || profile.email,
            phone: d.phone || '',
            degree: d.degree || '',
            university: d.university || '',
            graduationYear: d.graduationYear || '',
            yearsOfExperience: d.yearsOfExperience || 0,
            preferredRole: d.preferredRole || '',
            preferredLocation: d.preferredLocation || '',
            employmentPreference: d.employmentPreference || 'Full-time',
            workExperience: d.workExperience || '',
            certifications: d.certifications || '',
            skills: (d.skills || []).map(s => ({ id: s.skillId, name: s.name, proficiency: s.proficiency })),
          };
          setProfile(formatted);
          localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Backend profile fetch note:', err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (profile.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast(`Skill "${newSkillName}" already exists in your profile`, 'error');
      return;
    }

    try {
      const res = await apiClient.post('/profile/skills', {
        skillName: newSkillName.trim(),
        proficiency: newSkillProficiency
      });
      if (res.data?.data?.skills) {
        const backendSkills = res.data.data.skills.map(s => ({
          id: s.skillId,
          name: s.name,
          proficiency: s.proficiency
        }));
        const updated = { ...profile, skills: backendSkills };
        setProfile(updated);
        localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(updated));
        setNewSkillName('');
        showToast(`Added ${newSkillName.trim()} to your profile in database!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend add skill fallback:', err.message);
    }

    const updatedSkills = [...profile.skills, { name: newSkillName.trim(), proficiency: newSkillProficiency }];
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(updated));
    setNewSkillName('');
    showToast(`Added ${newSkillName} (${newSkillProficiency}) to your skills`, 'success');
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const targetSkill = profile.skills.find(s => s.name === skillToRemove);
    if (targetSkill && targetSkill.id) {
      try {
        const res = await apiClient.delete(`/profile/skills/${targetSkill.id}`);
        if (res.data?.data?.skills) {
          const backendSkills = res.data.data.skills.map(s => ({
            id: s.skillId,
            name: s.name,
            proficiency: s.proficiency
          }));
          const updated = { ...profile, skills: backendSkills };
          setProfile(updated);
          localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(updated));
          showToast(`Removed ${skillToRemove} from database`, 'info');
          return;
        }
      } catch (err) {
        console.warn('Backend delete skill fallback:', err.message);
      }
    }

    const updatedSkills = profile.skills.filter(s => s.name !== skillToRemove);
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(updated));
    showToast(`Removed ${skillToRemove}`, 'info');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: profile.fullName,
        phone: profile.phone,
        degree: profile.degree,
        university: profile.university,
        graduationYear: profile.graduationYear ? parseInt(profile.graduationYear) : null,
        yearsOfExperience: profile.yearsOfExperience ? parseInt(profile.yearsOfExperience) : 0,
        preferredRole: profile.preferredRole,
        preferredLocation: profile.preferredLocation,
        employmentPreference: profile.employmentPreference,
        workExperience: profile.workExperience,
        certifications: profile.certifications,
        skills: profile.skills.map(s => ({ skillName: s.name, proficiency: s.proficiency }))
      };

      const res = await apiClient.put('/profile', payload);
      if (res.data?.data) {
        showToast('Profile saved successfully in MySQL! Matching scores updated.', 'success');
      } else {
        showToast('Profile saved successfully!', 'success');
      }
    } catch (err) {
      console.warn('Backend save profile fallback:', err.message);
      showToast('Profile saved locally (offline mode)', 'info');
    } finally {
      localStorage.setItem('jobskillmatch_candidate_profile', JSON.stringify(profile));
      setIsSaving(false);
    }
  };

  // Calculate completion percentage
  const fields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.degree,
    profile.university,
    profile.graduationYear,
    profile.preferredRole,
    profile.preferredLocation,
    profile.workExperience,
    profile.certifications,
    profile.skills.length > 0
  ];
  const completedFields = fields.filter(Boolean).length;
  const completionPercentage = Math.round((completedFields / fields.length) * 100);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Candidate Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Keep your skills, education, and career preferences updated for precision job matching.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Completion Banner */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>Profile Completion</span>
            <span style={{ fontWeight: 800, color: 'var(--primary-600)' }}>{completionPercentage}%</span>
          </div>
          <div className="progress-container" style={{ height: '8px' }}>
            <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {completionPercentage === 100 
            ? 'Your profile is 100% complete. Ready for optimal job matching!' 
            : 'Fill all remaining fields to achieve maximum recommendation accuracy.'}
        </div>
      </div>

      <form onSubmit={handleSaveProfile}>
        {/* Personal Details */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary-600)" />
            <span>Personal &amp; Contact Information</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={profile.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={profile.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={profile.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Relevant Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                className="form-input"
                value={profile.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="30"
              />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={18} color="var(--violet-600)" />
            <span>Academic Background</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Degree / Qualification</label>
              <input
                type="text"
                name="degree"
                className="form-input"
                placeholder="e.g. B.Tech Computer Science"
                value={profile.degree}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="university"
                className="form-input"
                placeholder="e.g. National Institute of Technology"
                value={profile.university}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                className="form-input"
                value={profile.graduationYear}
                onChange={handleInputChange}
                min="2010"
                max="2035"
              />
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary-600)" />
            <span>Technical Skills Matrix ({profile.skills.length})</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Add skills and their respective proficiencies. The matching algorithm evaluates these against job requirements.
          </p>

          {/* Add skill row */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="e.g. Docker, TypeScript, Kafka..."
              className="form-input"
              style={{ flex: 2, minWidth: '180px' }}
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
            <select
              className="form-select"
              style={{ flex: 1, minWidth: '130px' }}
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem', padding: '0.65rem 1rem' }}
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Current Skills Cloud */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {profile.skills.map((skill) => (
              <div
                key={skill.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-dark)' }}>{skill.name}</span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
                  {skill.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.name)}
                  style={{ background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', padding: 0 }}
                  aria-label={`Remove ${skill.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Career Preferences */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={18} color="var(--sky-600)" />
            <span>Career Preferences &amp; Experience Summary</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred Job Role</label>
              <input
                type="text"
                name="preferredRole"
                className="form-input"
                value={profile.preferredRole}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Location</label>
              <input
                type="text"
                name="preferredLocation"
                className="form-input"
                value={profile.preferredLocation}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Internship / Work Experience Summary</label>
            <textarea
              name="workExperience"
              rows={3}
              className="form-textarea"
              value={profile.workExperience}
              onChange={handleInputChange}
              placeholder="Describe your previous internships, projects, or employment history..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certifications &amp; Courses</label>
            <input
              type="text"
              name="certifications"
              className="form-input"
              value={profile.certifications}
              onChange={handleInputChange}
              placeholder="e.g. AWS Certified Practitioner, Oracle Java SE 17..."
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isSaving}>
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfilePage;
