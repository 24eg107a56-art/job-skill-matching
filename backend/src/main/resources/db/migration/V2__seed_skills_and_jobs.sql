-- ===================================================================
-- Flyway Migration V2: Seed 30+ Normalized Skills & 12 Demo Job Listings
-- ===================================================================

-- 1. Insert Core Tech Skills
INSERT INTO skills (id, name, category, description) VALUES
(1, 'Java', 'Backend', 'Object-oriented programming language for enterprise backend systems'),
(2, 'Spring Boot', 'Backend', 'Production-ready framework for building Java microservices and REST APIs'),
(3, 'React', 'Frontend', 'Declarative UI library for building dynamic component-driven web applications'),
(4, 'JavaScript', 'Frontend', 'Dynamic scripting language powering modern web frontends and NodeJS'),
(5, 'HTML5', 'Frontend', 'Standard semantic markup language for structuring web pages'),
(6, 'CSS3', 'Frontend', 'Style sheet language for modern web UI layouts, flexbox, and grids'),
(7, 'Python', 'Backend/AI', 'High-level interpreted language used for backend, data science, and AI/ML'),
(8, 'MySQL', 'Database', 'Leading open-source relational database management system'),
(9, 'Git', 'Tools', 'Distributed version control system for tracking source code changes'),
(10, 'REST APIs', 'Backend', 'Representational State Transfer architectural pattern for HTTP services'),
(11, 'Docker', 'DevOps', 'Containerization platform for packaging and isolating distributed software'),
(12, 'Kubernetes', 'DevOps', 'Automated container orchestration, scaling, and deployment platform'),
(13, 'AWS', 'Cloud', 'Amazon Web Services cloud computing platform and managed cloud infrastructure'),
(14, 'Microservices', 'Architecture', 'Architectural pattern arranging applications as loosely coupled services'),
(15, 'Kafka', 'Streaming', 'Distributed event streaming platform for high-performance data pipelines'),
(16, 'SQL', 'Database', 'Structured Query Language for querying and managing relational databases'),
(17, 'Machine Learning', 'AI/Data', 'Algorithms and statistical models that learn from training datasets'),
(18, 'TensorFlow', 'AI/Data', 'End-to-end open-source machine learning platform by Google'),
(19, 'PyTorch', 'AI/Data', 'Deep learning framework for computer vision and NLP model training'),
(20, 'FastAPI', 'Backend', 'Modern, high-performance web framework for building Python APIs'),
(21, 'Linux', 'DevOps', 'Open-source Unix-like operating system powering enterprise servers'),
(22, 'Selenium', 'Testing', 'Automated browser testing suite for web application regression validation'),
(23, 'JUnit', 'Testing', 'Unit testing framework for the Java programming language'),
(24, 'Data Visualization', 'AI/Data', 'Visual representations of data including charts, plots, and dashboards'),
(25, 'TypeScript', 'Frontend', 'Strict syntactical superset of JavaScript that adds static typing')
ON DUPLICATE KEY UPDATE name=name;

-- 2. Insert 12 Required Demo Job Positions
INSERT INTO jobs (id, title, company, location, employment_type, min_experience, max_experience, salary_range, description, education_requirement, application_url, is_demo, is_active, posted_date) VALUES
(1, 'Java Developer', 'Apex Cloud Solutions', 'Bangalore, India (Hybrid)', 'Full-time', 0, 2, '₹6,00,000 - ₹9,50,000 / year', 'Develop scalable backend microservices and secure database connectors using Spring Boot and MySQL.', "Bachelor's in Computer Science or IT", 'https://demo.jobskillmatch.com/apply/1', TRUE, TRUE, '2026-10-01'),
(2, 'Python Developer', 'Cognitive Systems', 'Pune, India (Hybrid)', 'Full-time', 1, 3, '₹7,00,000 - ₹11,00,000 / year', 'Design backend APIs, asynchronous workers, and database ETL automation pipelines using Python and SQL.', "Bachelor's in Computer Science or Data Science", 'https://demo.jobskillmatch.com/apply/2', TRUE, TRUE, '2026-10-02'),
(3, 'Frontend Developer', 'PixelCraft Digital', 'Remote', 'Full-time', 1, 3, '₹6,50,000 - ₹10,50,000 / year', 'Build high-performance, accessible SaaS web interfaces using modern React, Vite, CSS3, and JavaScript.', "Bachelor's in CS or equivalent portfolio", 'https://demo.jobskillmatch.com/apply/3', TRUE, TRUE, '2026-10-03'),
(4, 'Backend Developer', 'Nexus FinTech', 'Hyderabad, India (On-site)', 'Full-time', 1, 4, '₹8,50,000 - ₹14,00,000 / year', 'Implement high-throughput banking endpoints, transactional persistence, and event consumers.', "B.Tech in Computer Science or IT", 'https://demo.jobskillmatch.com/apply/4', TRUE, TRUE, '2026-10-04'),
(5, 'Full-Stack Developer', 'Vanguard Software', 'Bangalore, India (Hybrid)', 'Full-time', 0, 3, '₹8,00,000 - ₹13,00,000 / year', 'End-to-end web engineering integrating responsive React client applications with robust Spring Boot REST services.', "Bachelor's degree in engineering or MCA", 'https://demo.jobskillmatch.com/apply/5', TRUE, TRUE, '2026-10-05'),
(6, 'Software Engineer', 'Global Infotech', 'Chennai, India (On-site)', 'Full-time', 0, 2, '₹5,50,000 - ₹8,50,000 / year', 'Write maintainable Java code, participate in sprint reviews, and deliver clean database integrations.', "B.E. / B.Tech / MCA", 'https://demo.jobskillmatch.com/apply/6', TRUE, TRUE, '2026-10-06'),
(7, 'Data Analyst', 'Quantum Analytics', 'Bangalore, India (On-site)', 'Full-time', 0, 2, '₹5,50,000 - ₹8,00,000 / year', 'Analyze operational metrics, write analytical SQL queries, and deliver business intelligence dashboards.', "Bachelor's in Statistics, Math, or Computer Science", 'https://demo.jobskillmatch.com/apply/7', TRUE, TRUE, '2026-10-07'),
(8, 'Machine Learning Engineer', 'DeepVision AI', 'Bangalore, India (On-site)', 'Full-time', 1, 3, '₹11,00,000 - ₹18,00,000 / year', 'Train, validate, and deploy machine learning models and inference endpoints using Python and TensorFlow.', "B.Tech / M.Tech in CS or AI", 'https://demo.jobskillmatch.com/apply/8', TRUE, TRUE, '2026-10-08'),
(9, 'AI Engineer', 'Neural Labs', 'Remote', 'Full-time', 1, 4, '₹12,00,000 - ₹20,00,000 / year', 'Build generative AI integrations, LLM pipelines, and automated retrieval-augmented generation systems.', "Master's or Bachelor's in CS / AI", 'https://demo.jobskillmatch.com/apply/9', TRUE, TRUE, '2026-10-09'),
(10, 'SQL Developer', 'DataCore Enterprise', 'Hyderabad, India (Hybrid)', 'Full-time', 1, 3, '₹6,00,000 - ₹9,00,000 / year', 'Write optimized stored procedures, indexes, triggers, and relational schemas on MySQL and PostgreSQL.', "Bachelor's in Computer Science", 'https://demo.jobskillmatch.com/apply/10', TRUE, TRUE, '2026-10-10'),
(11, 'Cloud Engineer', 'SkyScale Systems', 'Remote', 'Full-time', 2, 5, '₹10,00,000 - ₹16,00,000 / year', 'Provision cloud infrastructure on AWS, manage Kubernetes clusters, and automate Docker deployments.', "Bachelor's in Computer Engineering", 'https://demo.jobskillmatch.com/apply/11', TRUE, TRUE, '2026-10-11'),
(12, 'QA Engineer', 'VeriTest Solutions', 'Chennai, India (Hybrid)', 'Full-time', 1, 3, '₹5,00,000 - ₹7,50,000 / year', 'Automate API regression tests and web interface verification using Selenium, JUnit, and Java.', "B.E. / B.Tech / MCA", 'https://demo.jobskillmatch.com/apply/12', TRUE, TRUE, '2026-10-12')
ON DUPLICATE KEY UPDATE title=title;

-- 3. Link Required Skills to Jobs
-- Job 1: Java Developer -> Java(1), Spring Boot(2), MySQL(8), REST APIs(10), Git(9)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (1, 1), (1, 2), (1, 8), (1, 10), (1, 9);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (1, 11), (1, 13), (1, 14);

-- Job 2: Python Developer -> Python(7), SQL(16), REST APIs(10), Git(9)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (2, 7), (2, 16), (2, 10), (2, 9);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (2, 20), (2, 11);

-- Job 3: Frontend Developer -> React(3), JavaScript(4), HTML5(5), CSS3(6), Git(9)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (3, 3), (3, 4), (3, 5), (3, 6), (3, 9);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (3, 25), (3, 10);

-- Job 4: Backend Developer -> Java(1), Spring Boot(2), MySQL(8), REST APIs(10)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (4, 1), (4, 2), (4, 8), (4, 10);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (4, 11), (4, 14), (4, 15);

-- Job 5: Full-Stack Developer -> Java(1), Spring Boot(2), React(3), MySQL(8), REST APIs(10)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (5, 1), (5, 2), (5, 3), (5, 8), (5, 10);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (5, 9), (5, 11);

-- Job 6: Software Engineer -> Java(1), MySQL(8), Git(9), REST APIs(10)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (6, 1), (6, 8), (6, 9), (6, 10);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (6, 2), (6, 23);

-- Job 7: Data Analyst -> SQL(16), Python(7), Data Visualization(24)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (7, 16), (7, 7), (7, 24);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (7, 8);

-- Job 8: Machine Learning Engineer -> Python(7), Machine Learning(17), TensorFlow(18), Docker(11)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (8, 7), (8, 17), (8, 18), (8, 11);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (8, 19), (8, 20);

-- Job 9: AI Engineer -> Python(7), Machine Learning(17), PyTorch(19), REST APIs(10)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (9, 7), (9, 17), (9, 19), (9, 10);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (9, 11), (9, 13);

-- Job 10: SQL Developer -> SQL(16), MySQL(8)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (10, 16), (10, 8);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (10, 7), (10, 21);

-- Job 11: Cloud Engineer -> Docker(11), Kubernetes(12), Linux(21), AWS(13), Git(9)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (11, 11), (11, 12), (11, 21), (11, 13), (11, 9);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (11, 7);

-- Job 12: QA Engineer -> Java(1), Selenium(22), JUnit(23), Git(9)
INSERT IGNORE INTO job_required_skills (job_id, skill_id) VALUES (12, 1), (12, 22), (12, 23), (12, 9);
INSERT IGNORE INTO job_preferred_skills (job_id, skill_id) VALUES (12, 10);
