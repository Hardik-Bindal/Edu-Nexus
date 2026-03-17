# EduNexus

EduNexus is a full-stack learning platform with:
- Role-based auth (`student`, `teacher`)
- Quiz creation (manual + AI), attempts, and result review
- Leaderboard and gamification points
- Study materials and groups
- Daily facts, games, and news feed

## Project Structure

- `backend/`: Express + MongoDB API
- `frontend/`: React + Vite app

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required `backend/.env` values:
- `MONGO_URI`
- `JWT_SECRET`
- `NEWS_API_KEY`
- `OPENAI_API_KEY`

### Seed Sample Data (Recommended for First Run)

```bash
cd backend
npm run seed
```

This command clears existing collections and inserts demo users, quizzes, results, groups,
materials, daily facts, daily games, and news records.

Demo credentials after seed:
- Teacher: `teacher@edunexus.demo` / `Teacher@123`
- Teacher: `mentor@edunexus.demo` / `Teacher@123`
- Students: `rahul|priya|arjun|sana|dev@edunexus.demo` / `Student@123`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Required `frontend/.env` values:
- `VITE_API_BASE_URL` (example: `http://localhost:8080/api`)

## Available App Routes

### Student
- `/student`
- `/student/attempt/:quizId`
- `/student/results`
- `/student/results/:resultId`
- `/student/leaderboard`
- `/student/materials`
- `/student/groups`
- `/student/news`
- `/student/facts`
- `/student/games`

### Teacher
- `/teacher`
- `/teacher/create-quiz`
- `/teacher/update-quiz/:quizId`
- `/teacher/results/:quizId`
- `/teacher/result/:resultId`
- `/teacher/leaderboard`
- `/teacher/materials`
- `/teacher/groups`
- `/teacher/news`
- `/teacher/facts`
- `/teacher/games`

## Security Note

If any real keys were previously committed, rotate them now in provider dashboards and replace them in local `.env` only.
