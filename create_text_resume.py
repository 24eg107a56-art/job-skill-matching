resume_text = """
ARUN KUMAR
Email: arun.candidate@example.com | Phone: +91 98765 43210
Bangalore, Karnataka, India

PROFESSIONAL SUMMARY
Passionate Full-Stack Developer with solid expertise in building enterprise web applications, RESTful microservices, and modern responsive frontends. Experienced in Agile environments, code reviews, and containerized deployments.

TECHNICAL SKILLS
- Programming Languages: Java, Python, JavaScript, TypeScript
- Frameworks & Libraries: Spring Boot, React, Node.js, Express, Next.js
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- Cloud & DevOps: Docker, Kubernetes, AWS, Git, CI/CD, Linux
- Architecture & Tools: REST APIs, Microservices, HTML5, CSS3, TailwindCSS

EDUCATION
Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)
National Institute of Engineering (2021 - 2025) - CGPA: 8.8/10

WORK EXPERIENCE
Software Developer Intern at InnovateTech Solutions (July 2024 - Present)
- Developed scalable backend services using Spring Boot and JPA, handling 50k+ daily API requests.
- Integrated interactive dashboard components in React with optimized state management.
- Containerized microservices using Docker and orchestrated development deployments.
- Implemented JWT authentication and role-based access control (RBAC).

PROJECTS
- Job & Skill Matching Portal: Full-stack application matching candidates with real-time job openings using skill gap analysis and automated career roadmaps.
- E-Commerce Inventory Microservice: High-throughput order management with MySQL, Redis cache, and Kafka events.

CERTIFICATIONS
- Oracle Certified Associate: Java SE 17 Developer
- AWS Certified Cloud Practitioner (CLF-C02)
"""

with open("sample_resume.txt", "w", encoding="utf-8") as f:
    f.write(resume_text.strip())

print("Created sample_resume.txt successfully")
