import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Award, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';

const DEFAULT_ROADMAP = {
  targetRole: 'Full-Stack Java & Cloud Developer',
  items: [
    {
      id: 1,
      skill: 'Docker Containerization Fundamentals',
      duration: '2 Weeks',
      priority: 'High',
      level: 'Intermediate',
      completed: true,
      objectives: 'Understand Dockerfiles, image caching, multi-stage builds, and container networking.',
      resource: 'https://docs.docker.com/get-started/',
      resourceName: 'Official Docker Get Started Guide'
    },
    {
      id: 2,
      skill: 'Spring Microservices & REST Security',
      duration: '3 Weeks',
      priority: 'High',
      level: 'Intermediate',
      completed: true,
      objectives: 'Build distributed services, implement JWT stateless authentication and API gateways.',
      resource: 'https://spring.io/guides/tutorials/rest/',
      resourceName: 'Spring Official Building REST Services'
    },
    {
      id: 3,
      skill: 'AWS Cloud Deployment (EC2, S3 & RDS)',
      duration: '3 Weeks',
      priority: 'High',
      level: 'Advanced',
      completed: false,
      objectives: 'Deploy production Spring Boot JARs and React builds with managed relational MySQL instances.',
      resource: 'https://aws.amazon.com/getting-started/hands-on/',
      resourceName: 'AWS Hands-On Cloud Deployment Tutorials'
    },
    {
      id: 4,
      skill: 'Apache Kafka Event Streaming Basics',
      duration: '2 Weeks',
      priority: 'Medium',
      level: 'Advanced',
      completed: false,
      objectives: 'Understand producer/consumer architecture, topics, and asynchronous message broker patterns.',
      resource: 'https://kafka.apache.org/quickstart',
      resourceName: 'Apache Kafka Official Quickstart'
    },
    {
      id: 5,
      skill: 'Kubernetes Cluster Orchestration',
      duration: '4 Weeks',
      priority: 'Medium',
      level: 'Advanced',
      completed: false,
      objectives: 'Deploy Pods, Deployments, ConfigMaps, and Services on a managed Kubernetes cluster.',
      resource: 'https://kubernetes.io/docs/tutorials/',
      resourceName: 'Kubernetes Official Tutorials'
    }
  ]
};

const CareerRoadmapPage = () => {
  const { showToast } = useToast();
  const [roadmap, setRoadmap] = useState(() => {
    const custom = localStorage.getItem('jobskillmatch_custom_roadmap');
    return custom ? JSON.parse(custom) : DEFAULT_ROADMAP;
  });

  // Fetch roadmap from backend API on mount
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await apiClient.get('/roadmap');
        if (res.data?.data) {
          const d = res.data.data;
          const mapped = {
            targetRole: d.targetRole,
            items: (d.items || []).map(i => ({
              id: i.id,
              skill: i.skillName,
              duration: i.estimatedDuration,
              priority: i.priority,
              level: i.level || 'Intermediate',
              completed: Boolean(i.completed),
              objectives: i.objectives,
              resource: i.resourceUrl,
              resourceName: i.resourceName
            }))
          };
          setRoadmap(mapped);
          localStorage.setItem('jobskillmatch_custom_roadmap', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Backend roadmap note, using local roadmap:', err.message);
      }
    };
    fetchRoadmap();
  }, []);

  const items = roadmap.items || [];
  const completedCount = items.filter(i => i.completed).length;
  const progressPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const toggleItemComplete = async (itemId) => {
    // Optimistic UI update
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const nextState = !item.completed;
        showToast(nextState ? `Completed milestone: ${item.skill}!` : `Marked ${item.skill} as pending`, 'info');
        return { ...item, completed: nextState };
      }
      return item;
    });

    const updatedRoadmap = { ...roadmap, items: updatedItems };
    setRoadmap(updatedRoadmap);
    localStorage.setItem('jobskillmatch_custom_roadmap', JSON.stringify(updatedRoadmap));

    // Persist to backend
    try {
      await apiClient.patch(`/roadmap/items/${itemId}/toggle`);
    } catch (err) {
      console.warn('Backend toggle note, kept local state:', err.message);
    }
  };

  const handleResetProgress = () => {
    const resetItems = items.map(i => ({ ...i, completed: false }));
    const resetRoadmap = { ...roadmap, items: resetItems };
    setRoadmap(resetRoadmap);
    localStorage.setItem('jobskillmatch_custom_roadmap', JSON.stringify(resetRoadmap));
    showToast('Roadmap progress reset', 'info');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>Target Role: {roadmap.targetRole}</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Personalized Career Learning Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            A structured, step-by-step curriculum with curated documentation links to bridge your identified skill gaps.
          </p>
        </div>

        <button onClick={handleResetProgress} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
          <RotateCcw size={14} />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Curriculum Completion Progress</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {completedCount} of {items.length} milestones accomplished
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)' }}>
            {progressPercentage}%
          </div>
        </div>

        <div className="progress-container" style={{ height: '12px' }}>
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Stepped Roadmap Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="card"
            style={{
              padding: '1.75rem',
              borderLeft: item.completed ? '5px solid var(--success-500)' : '5px solid var(--primary-500)',
              backgroundColor: item.completed ? 'rgba(236, 253, 245, 0.4)' : '#FFFFFF',
              transition: 'all var(--transition-normal)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleItemComplete(item.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: item.completed ? 'var(--success-500)' : 'transparent',
                    border: item.completed ? 'none' : '2px solid var(--border-light)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {item.completed ? <Check size={18} /> : <Circle size={18} color="var(--text-light)" />}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Step #{index + 1}</span>
                    <span className={`badge ${item.priority === 'High' ? 'badge-missing' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: item.completed ? 'var(--success-700)' : 'var(--text-dark)',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>
                    {item.skill}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={15} />
                <span>Est: {item.duration}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '1.25rem', paddingLeft: '2.75rem' }}>
              {item.objectives}
            </p>

            <div style={{ paddingLeft: '2.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <a
                href={item.resource}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 600 }}
              >
                <span>Study: {item.resourceName}</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => toggleItemComplete(item.id)}
                className={`btn btn-sm ${item.completed ? 'btn-secondary' : 'btn-primary'}`}
                style={{ gap: '0.35rem' }}
              >
                {item.completed ? (
                  <>
                    <CheckCircle2 size={15} color="var(--success-600)" />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Mark as Finished</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
