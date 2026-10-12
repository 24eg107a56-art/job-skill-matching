# JobSkillMatch — Backend REST API

> **AI-Powered Job & Skill Matching Portal** — Enterprise Spring Boot 3.4.3 REST API with MySQL 8, Spring Data JPA, Spring Security, JJWT 0.12.6, and Apache Tika / PDFBox document extraction.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## 🚀 Key Highlights & Architecture

- **Clean Layered Architecture:**
  - Controllers -> Services -> Repositories -> JPA Entities -> Flyway Migrations
  - Standardized JSON envelope: `ApiResponse<T>` with timestamp and error message.
  - Centralized exception handling via `@RestControllerAdvice` (`GlobalExceptionHandler`).

- **Security & Authorization:**
  - Stateless JWT authentication via JJWT 0.12.6 with SHA-256 HMAC keys.
  - Role-Based Access Control (`ROLE_CANDIDATE`, `ROLE_ADMIN`).
  - Protected endpoints with `@PreAuthorize("hasRole('ADMIN')")`.

- **Multi-Engine Document Parser:**
  - Apache PDFBox 3.0.3 for fast PDF binary parsing.
  - Apache POI 5.3.0 for DOCX parsing.
  - Apache Tika 2.9.2 facade fallback.
  - Rule-based technology keyword tokenizer matching against MySQL database skills.

- **Intelligent Skill Matching & Roadmap Engine:**
  - Match Formula: $(matched\_skills / required\_skills) \times 100$.
  - Gap Analysis with automated learning recommendations and documentation links.
  - Personalized milestone-based career roadmap generation and progress tracking.

---

## 🛠️ Technology Stack

- **Runtime:** Java 17+ (Tested on Java 17 and Java 27)
- **Framework:** Spring Boot 3.4.3
- **Database:** MySQL 8.0 with HikariCP Connection Pooling
- **Database Migrations:** Flyway 10.x
- **Build Tool:** Maven Wrapper (`./mvnw` or `.\mvnw.cmd`)
- **Containerization:** Multi-stage Dockerfile with Eclipse Temurin JRE

---

## 📦 Local Development Setup

1. **MySQL Database:**
   Ensure MySQL 8.0 is running locally on port 3306 with database:
   ```sql
   CREATE DATABASE IF NOT EXISTS jobskillmatch_db;
   ```

2. **Configure Environment:**
   Review `src/main/resources/application.properties` or set environment variables:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=jobskillmatch_db
   DB_USERNAME=root
   DB_PASSWORD=root
   ```

3. **Run Application:**
   ```bash
   # Windows PowerShell:
   .\mvnw.cmd spring-boot:run

   # Linux/macOS:
   ./mvnw spring-boot:run
   ```

4. **Health Check:**
   ```bash
   curl http://localhost:8080/api/health
   ```

---

## 🔑 Default Seeded Accounts

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@jobskillmatch.com` | `admin123` |
| **Demo Candidate** | `arun.candidate@example.com` | `candidate123` |

---

## 🌐 Deployment to Render

1. Push this directory to a separate GitHub repository named `JobSkillMatch-Backend`.
2. In Render, create a new **Web Service** connected to the repository.
3. Select **Docker** environment (or use `render.yaml`).
4. Set the Environment Variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` (from your managed cloud MySQL / Aiven / PlanetScale instance).
   - `JWT_SECRET`: Random 64-character hex string.
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g. `https://jobskillmatch.vercel.app`).
