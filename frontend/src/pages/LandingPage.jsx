import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  Compass, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Award,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: 'Precision Skill Matching',
      description: 'Calculates exact match percentages by comparing your technical abilities against verified job requirements.',
      color: 'var(--primary-600)'
    },
    {
      icon: FileText,
      title: 'Resume Intelligence',
      description: 'Rule-based text extraction parses PDFs and DOCX resumes, identifying technical skills, education, and experience.',
      color: 'var(--violet-600)'
    },
    {
      icon: Compass,
      title: 'Skill Gap Analyzer',
      description: 'Pinpoints exactly which high-demand skills you are missing for your dream position and ranks them by priority.',
      color: 'var(--sky-600)'
    },
    {
      icon: BookOpen,
      title: 'Personalized Career Roadmaps',
      description: 'Converts identified skill gaps into step-by-step learning modules with curated, reputable free documentation links.',
      color: 'var(--success-600)'
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Build Your Profile', desc: 'Add your education, work experience, and technical skill proficiencies or upload your resume.' },
    { step: '02', title: 'Automated Skill Matching', desc: 'Our engine cross-references your profile with active job listings to compute normalized match scores.' },
    { step: '03', title: 'Identify Skill Gaps', desc: 'Instantly view matched skills versus missing requirements for any target role.' },
    { step: '04', title: 'Follow Your Roadmap', desc: 'Complete personalized learning milestones, track your progress, and apply with confidence.' }
  ];

  const categories = [
    { name: 'Java & Spring Boot', count: '14 Jobs', icon: Cpu },
    { name: 'Frontend React', count: '18 Jobs', icon: Sparkles },
    { name: 'Full-Stack Engineering', count: '22 Jobs', icon: Briefcase },
    { name: 'Python & AI Engineering', count: '12 Jobs', icon: TrendingUp },
    { name: 'Cloud & DevOps', count: '9 Jobs', icon: Target },
    { name: 'Data Analysis', count: '11 Jobs', icon: Award }
  ];

  const testimonials = [
    {
      quote: "JobSkillMatch showed me exactly which Spring Boot and Docker concepts I lacked for junior backend roles. Landed my first role within 2 months!",
      author: "Pooja Sharma",
      role: "Junior Software Engineer (Sample Demonstration Story)",
      match: "92% Match Achieved"
    },
    {
      quote: "The resume analyzer extracted my skills instantly, and the roadmap gave me structured links to official documentation instead of random tutorials.",
      author: "Rohan Patel",
      role: "React Frontend Developer (Sample Demonstration Story)",
      match: "88% Match Achieved"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-main) 100%)',
        padding: '5.5rem 0 4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid var(--primary-200)'
            }}>
              <Sparkles size={16} />
              <span>Intelligent Career Matching &amp; Skill Gap Analytics</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: 'var(--text-dark)'
            }}>
              Find Your Perfect <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Career Match</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              color: 'var(--text-body)',
              lineHeight: 1.6,
              marginBottom: '2.5rem'
            }}>
              Analyze your skills, education, and resume against real job market requirements. 
              Discover matched opportunities, uncover your missing skills, and follow a personalized learning roadmap to get hired.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/jobs" className="btn btn-secondary btn-lg">
                Explore Jobs
              </Link>
            </div>

            {/* Quick Demo Stats Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              marginTop: '4rem',
              padding: '1.75rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)' }}>100%</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Objective Match Formulas</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--violet-600)' }}>50+</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tech Skills Analyzed</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--sky-600)' }}>PDF &amp; DOCX</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Resume Parsing Support</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success-600)' }}>Full-Stack</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>React + Spring Boot + MySQL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Core Capabilities
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem' }}>
              Engineered for Career Advancement
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Everything you need to understand where you stand in today's tech hiring market and how to bridge any gap.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="card card-interactive" style={{ padding: '2rem' }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    color: feat.color
                  }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.925rem' }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>
              Workflow
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem' }}>
              How JobSkillMatch Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {howItWorks.map((item, idx) => (
              <div key={idx} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--primary-100)',
                  lineHeight: 1
                }}>
                  {item.step}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1.5rem' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>
                Browse Demand
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
                Popular Tech Domains
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary btn-sm">
              View All Categories <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link to="/jobs" key={idx} className="card card-interactive" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demonstration Testimonials */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-demo" style={{ marginBottom: '0.75rem' }}>Sample Demonstration Stories</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Student &amp; Graduate Success</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-body)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t.author}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</p>
                    </div>
                    <span className="badge badge-matched">{t.match}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%)',
        color: '#FFFFFF',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to find your match?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--primary-200)', marginBottom: '2rem' }}>
            Create your candidate profile, upload your resume, and discover your personalized career roadmap today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary-800)' }}>
              Get Started Now
            </Link>
            <Link to="/jobs" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'var(--primary-400)' }}>
              Browse Demo Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
