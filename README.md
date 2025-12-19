# HackTrack AI

A sophisticated hackathon management system with elegant "Scholar's Desk" design for tracking participation, progress, and outcomes.

## Features

- **Smart Status Flow**: `PLANNED → IN_PROGRESS → SUBMITTED → WON/LOST`
- **Auto-Expiration**: Past hackathons automatically marked as expired
- **Results Tracking**: Filter SUBMITTED hackathons to see pending results
- **Project Counter**: Track drafts per hackathon
- **Priority System**: CRITICAL, HIGH, MEDIUM, LOW levels
- **Responsive Design**: Works on all screen sizes
- **Pagination**: Handle large datasets efficiently

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

Create `.env` file:
```env
DATABASE_URL=your_neon_postgresql_url
```

## Tech Stack

- **Next.js 16** + TypeScript
- **Neon PostgreSQL** (serverless)
- **Tailwind CSS** (custom design system)
- **Lucide React** (icons)

## Database Schema

```sql
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  url TEXT,
  deadline TIMESTAMP NOT NULL,
  priority VARCHAR CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status VARCHAR CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'SUBMITTED', 'WON', 'LOST', 'ABANDONED')),
  notes TEXT,
  theme VARCHAR,
  prize_pool VARCHAR,
  project_count INTEGER DEFAULT 0,
  is_finalized BOOLEAN DEFAULT FALSE,
  is_expired BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment on Vercel

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `DATABASE_URL`
   - Deploy automatically

3. **Environment Variables**:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string

That's it! Your app will be live at `your-app.vercel.app`
