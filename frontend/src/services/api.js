import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to request headers if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobskillmatch_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for token expiration or errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem('jobskillmatch_token');
      localStorage.removeItem('jobskillmatch_user');
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// Seeded Demo Jobs for Demonstration & Standalone Mode
// -------------------------------------------------------------
export const INITIAL_DEMO_JOBS = [
  {
    id: 1,
    title: 'Java Backend Developer',
    company: 'Apex Cloud Solutions',
    location: 'Bangalore, India (Hybrid)',
    employmentType: 'Full-time',
    minExperience: 0,
    maxExperience: 2,
    salaryRange: '₹6,00,000 - ₹9,50,000 / year',
    description: 'Looking for a Java developer to build scalable microservices using Spring Boot, JPA, MySQL, and Docker.',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'Microservices', 'Kafka'],
    educationRequirement: "Bachelor's in Computer Science or IT",
    postedDate: '2026-10-01',
    isDemo: true,
  },
  {
    id: 2,
    title: 'Frontend React Developer',
    company: 'PixelCraft Digital',
    location: 'Remote',
    employmentType: 'Full-time',
    minExperience: 1,
    maxExperience: 3,
    salaryRange: '₹7,00,000 - ₹11,00,000 / year',
    description: 'Create high-performance SaaS user interfaces with modern React, Vite, TailwindCSS / CSS3, and state management.',
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    preferredSkills: ['TypeScript', 'Next.js', 'Redux', 'UI/UX Design'],
    educationRequirement: "Bachelor's in Computer Science or equivalent experience",
    postedDate: '2026-10-05',
    isDemo: true,
  },
  {
    id: 3,
    title: 'Full-Stack Software Engineer',
    company: 'Nexus FinTech',
    location: 'Hyderabad, India (On-site)',
    employmentType: 'Full-time',
    minExperience: 0,
    maxExperience: 3,
    salaryRange: '₹8,00,000 - ₹13,00,000 / year',
    description: 'Develop end-to-end banking portals integrating React frontend with Spring Boot backend and secure payment APIs.',
    requiredSkills: ['Java', 'Spring Boot', 'React', 'MySQL', 'REST APIs'],
    preferredSkills: ['Docker', 'Spring Security', 'JWT', 'Kubernetes'],
    educationRequirement: 'B.Tech / B.E. in Computer Science',
    postedDate: '2026-10-08',
    isDemo: true,
  },
  {
    id: 4,
    title: 'Python & AI Engineer',
    company: 'Cognitive AI Labs',
    location: 'Pune, India (Hybrid)',
    employmentType: 'Full-time',
    minExperience: 1,
    maxExperience: 4,
    salaryRange: '₹9,00,000 - ₹15,00,000 / year',
    description: 'Build predictive machine learning pipelines, LLM fine-tuning solutions, and vector search integrations.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'FastAPI', 'Git'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'LangChain', 'Docker'],
    educationRequirement: 'Master’s or Bachelor’s in CS / Data Science',
    postedDate: '2026-10-02',
    isDemo: true,
  },
  {
    id: 5,
    title: 'Data Analyst',
    company: 'Quantum Analytics',
    location: 'Bangalore, India (On-site)',
    employmentType: 'Full-time',
    minExperience: 0,
    maxExperience: 2,
    salaryRange: '₹5,50,000 - ₹8,00,000 / year',
    description: 'Transform complex business datasets into actionable dashboards using SQL, Tableau, and Python.',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
    preferredSkills: ['PowerBI', 'Tableau', 'Statistics', 'Pandas'],
    educationRequirement: 'Bachelor’s in Statistics, Math, or Computer Science',
    postedDate: '2026-10-06',
    isDemo: true,
  },
  {
    id: 6,
    title: 'Cloud DevOps Engineer',
    company: 'SkyScale Systems',
    location: 'Remote',
    employmentType: 'Full-time',
    minExperience: 2,
    maxExperience: 5,
    salaryRange: '₹10,00,000 - ₹16,00,000 / year',
    description: 'Automate CI/CD pipelines, container orchestration, and cloud infrastructure on AWS and Kubernetes.',
    requiredSkills: ['Docker', 'Kubernetes', 'Linux', 'AWS', 'Git'],
    preferredSkills: ['Terraform', 'CI/CD', 'Ansible', 'Python'],
    educationRequirement: 'Bachelor’s in Computer Engineering',
    postedDate: '2026-09-28',
    isDemo: true,
  },
  {
    id: 7,
    title: 'QA Automation Engineer',
    company: 'VeriTest Solutions',
    location: 'Chennai, India (Hybrid)',
    employmentType: 'Full-time',
    minExperience: 1,
    maxExperience: 3,
    salaryRange: '₹5,00,000 - ₹7,50,000 / year',
    description: 'Write robust automated tests for web APIs and UI applications using Selenium, Java, and JUnit.',
    requiredSkills: ['Java', 'Selenium', 'JUnit', 'Git', 'REST APIs'],
    preferredSkills: ['Cypress', 'Postman', 'TestNG', 'Jenkins'],
    educationRequirement: 'B.E. / B.Tech / MCA',
    postedDate: '2026-10-03',
    isDemo: true,
  },
  {
    id: 8,
    title: 'Machine Learning Engineer',
    company: 'DeepVision AI',
    location: 'Bangalore, India (On-site)',
    employmentType: 'Full-time',
    minExperience: 1,
    maxExperience: 3,
    salaryRange: '₹11,00,000 - ₹18,00,000 / year',
    description: 'Design and deploy computer vision and NLP models into scalable production inference endpoints.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Docker'],
    preferredSkills: ['PyTorch', 'OpenCV', 'MLflow', 'FastAPI'],
    educationRequirement: 'B.Tech / M.Tech in CS or AI',
    postedDate: '2026-10-09',
    isDemo: true,
  }
];

export const INITIAL_CANDIDATE_PROFILE = {
  fullName: 'Arun Kumar',
  email: 'arun.candidate@example.com',
  phone: '+91 98765 43210',
  degree: 'B.Tech in Computer Science and Engineering',
  university: 'National Institute of Engineering',
  graduationYear: 2025,
  yearsOfExperience: 1,
  preferredRole: 'Java Full-Stack Developer',
  preferredLocation: 'Bangalore, India',
  employmentPreference: 'Full-time / Hybrid',
  skills: [
    { name: 'Java', proficiency: 'Advanced' },
    { name: 'Spring Boot', proficiency: 'Intermediate' },
    { name: 'React', proficiency: 'Intermediate' },
    { name: 'JavaScript', proficiency: 'Intermediate' },
    { name: 'HTML5', proficiency: 'Advanced' },
    { name: 'CSS3', proficiency: 'Intermediate' },
    { name: 'Git', proficiency: 'Intermediate' },
    { name: 'MySQL', proficiency: 'Intermediate' },
  ],
  workExperience: '6 months Internship as Junior Web Developer at InnovateTech Solutions.',
  certifications: 'Oracle Certified Associate Java SE, AWS Certified Cloud Practitioner',
  resumeText: 'Full Stack Developer with solid fundamentals in Java, Spring Boot, React, and MySQL database design.',
};

export default apiClient;
