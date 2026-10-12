# JobSkillMatch — Frontend Web Application

> **AI-Powered Job & Skill Matching Portal** — Responsive React 18 & Vite SPA built with Vanilla CSS design system tokens, Recharts, and Lucide React.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🚀 Key Highlights & Features

- **Candidate Journey:**
  - Modern authentication with JWT persistence and route guards.
  - Comprehensive candidate profile editor with academic background and technical skills matrix.
  - Document Resume Analyzer supporting **PDF, DOCX, and TXT** with live text keyword extraction, ATS scoring, and profile syncing.
  - Precision skill matching $(matched / required) \times 100$ and personalized career roadmap milestones.
  - Skill gap visualizer with direct curated documentation links to fill identified gaps.
  - One-click job application submission and bookmarks drawer.

- **Admin Console:**
  - Complete platform governance console with live metrics cards.
  - Active job vacancy creation, modification, and deletion.
  - Applications pipeline manager with real-time status progression.
  - Registered candidates directory with verified skill matrices.

---

## 🛠️ Technology Stack

- **Framework:** React 18 + Vite 8
- **Styling:** Vanilla CSS Design Tokens (`src/index.css`) with sleek dark/light contrast, custom badges, and responsive glassmorphism.
- **Routing:** React Router DOM 6
- **HTTP Client:** Axios (configured with auto-JWT authorization interceptor)
- **Visuals:** Lucide React icons, Recharts interactive data visualizations

---

## 📦 Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create `.env.local` or `.env`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment to Vercel

1. Push this directory to a separate GitHub repository named `JobSkillMatch-Frontend`.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variable:
   - `VITE_API_BASE_URL`: `https://jobskillmatch-backend.onrender.com/api` (your deployed Render API URL)
4. Deploy! Vercel automatically honors `vercel.json` for client-side routing.
