# HackTrack AI

Minimal hackathon management system with Neon PostgreSQL.

## Features

- Track hackathons with deadlines, priorities, and status
- Filter by status and priority
- Search by title and theme
- Automatic sorting by deadline (soonest first)
- Clean, minimal UI

## Setup

```bash
npm install

# Terminal 1 - Start API server (port 3002)
npm run api

# Terminal 2 - Start frontend (port 3001)
npm run dev
```

Open http://localhost:3001 in your browser.

## Database

- **Project**: HackTrack AI
- **Project ID**: `late-mouse-62757284`
- **Database**: `neondb`

### Schema

```sql
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  url TEXT,
  deadline TIMESTAMP NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  theme VARCHAR(255),
  prize_pool VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Neon PostgreSQL
- Lucide Icons
