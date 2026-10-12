# JobSkillMatch — AI-Powered Job & Skill Matching Portal

JobSkillMatch is an enterprise-grade full-stack web application that intelligently bridges candidate technical proficiencies with real-world job requirements through automated resume parsing, precision matching scoring, skill gap diagnostics, and custom career roadmaps.

---

## 🏗️ Physical Repository Architecture

To support seamless, independent production deployments, the project is strictly decoupled into two standalone repositories:

```
JobSkillMatch/
├── frontend/             --> Dedicated GitHub Repo: "JobSkillMatch-Frontend" (Deploy to Vercel)
│   ├── src/
│   │   ├── components/   # Reusable UI cards, modal, badges, navbar
│   │   ├── context/      # AuthContext & ToastContext
│   │   ├── pages/        # 14 Full React application views
│   │   └── services/     # Axios client & Seeded fallback models
│   ├── vercel.json       # SPA routing rewrite configuration
│   ├── .env.example      # Environment variables template
│   └── package.json
│
└── backend/              --> Dedicated GitHub Repo: "JobSkillMatch-Backend" (Deploy to Render)
    ├── src/main/java/com/jobskillmatch/
    │   ├── config/       # Security, CORS, Flyway, DataInitializer
    │   ├── controller/   # 10 Spring Boot REST Controllers
    │   ├── dto/          # Data Transfer Objects
    │   ├── entity/       # 11 JPA Entities
    │   ├── exception/    # Centralized Exception Handler
    │   ├── repository/   # 10 Spring Data JPA Repositories
    │   ├── security/     # JJWT 0.12.6 Filters & Token Provider
    │   └── service/      # Matching, Resume Parser, Profile & Job Services
    ├── Dockerfile        # Multi-stage production container build
    ├── render.yaml       # Render Blueprint cloud deployment file
    └── pom.xml
```

---

## ⚡ Quick Start (Local Full-Stack Setup)

### 1. Database Setup
Start your local MySQL service (port 3306) and ensure `jobskillmatch_db` exists:
```sql
CREATE DATABASE IF NOT EXISTS jobskillmatch_db;
```

### 2. Backend Startup
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*Backend API available at: `http://localhost:8080/api`*

### 3. Frontend Startup
```powershell
cd frontend
npm install
npm run dev
```
*Frontend Portal available at: `http://localhost:5173`*

---

## 🔐 Credentials for Demonstration

- **Candidate Account:** `arun.candidate@example.com` / `candidate123`
- **Admin Account:** `admin@jobskillmatch.com` / `admin123`
