# VSICS Online Learning Platform

A centralized academic and placement management system for Virendra Swarup Institute of Computer Studies (VSICS).

## Tech Stack

- **Frontend**: React 19, Vite 7, React Router 7, Axios, Tailwind CSS
- **Backend**: Node.js, Express 5, ES Modules
- **Database**: MySQL 8+ via mysql2/promise
- **Auth**: bcrypt + JWT (7-day expiry)
- **Uploads**: multer (local disk)
- **Testing**: Jest + Supertest (backend), Vitest (frontend)

## Core Features

- 🔐 Authentication with role-based access (admin, faculty, student)
- 📚 Notes & Papers upload/download
- 📋 Attendance marking with duplicate prevention
- 📝 Assignments with student submissions
- 💼 Placement postings
- 📢 Digital notice board
- 🌐 External courses (enroll + certificate upload)

## Quick Start

### 1. Setup Database

```bash
cd backend
cp .env.example .env   # Edit with your MySQL credentials
npm install
npm run migrate        # Creates DB, tables, and seed data
```

### 2. Start Backend

```bash
cd backend
npm run dev            # Runs on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # Runs on http://localhost:5173
```

### Seed Credentials

| Role    | Email              | Password       |
|---------|-------------------|----------------|
| Admin   | admin@vsics.test  | AdminPass123   |
| Faculty | faculty@vsics.test | FacultyPass123 |
| Student | student1@vsics.test | StudentPass123 |
| Student | student2@vsics.test | StudentPass123 |

## API Examples (curl)

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vsics.test","password":"AdminPass123"}'
```

### Upload Resource (faculty)
```bash
curl -X POST http://localhost:5000/api/resources \
  -H "Authorization: Bearer <token>" \
  -F "title=Test Note" -F "subject_id=1" -F "file=@./test.pdf"
```

### Mark Attendance (faculty)
```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"subject_id":1,"date":"2026-02-20","records":[{"student_id":3,"status":"present"}]}'
```

### Submit Assignment (student)
```bash
curl -X POST http://localhost:5000/api/assignments/1/submit \
  -H "Authorization: Bearer <student_token>" \
  -F "file=@./answer.pdf"
```

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npx vitest run
```

## Documentation

See the `docs/` folder for detailed documentation:

- [Architecture](docs/ARCHITECTURE.md) — System diagram, routes, DB schema
- [Component Map](docs/COMPONENT_MAP.md) — File → feature mapping
- [Test Plan](docs/TEST_PLAN.md) — How to run tests, manual test steps
- [Maintenance](docs/MAINTENANCE.md) — Backup, secrets, releases
- [Troubleshooting](docs/TROUBLESHOOTING.md) — Common issues + fixes
- [Verification Checklist](docs/VERIFY_CHECKLIST.md) — Acceptance criteria
- [Development Guide](docs/DEVELOPMENT_GUIDE.md) — Branch strategy, commits, adding features

## Project Structure

```
olpvsics/
├── backend/
│   ├── db/                    # DB pool, migrations, migrate runner
│   │   ├── index.js           # mysql2 connection pool
│   │   ├── migrate.js         # Migration runner script
│   │   └── migrations/        # SQL migration files
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── server.js          # Server entry point
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Auth, roles, upload, validation
│   │   ├── models/            # DB model helpers
│   │   └── routes/            # Express routes
│   ├── test/                  # Jest test files
│   └── uploads/               # Uploaded files
├── frontend/
│   ├── src/
│   │   ├── context/           # AuthContext
│   │   ├── components/        # RequireAuth, RequireRole
│   │   ├── pages/             # All page components
│   │   └── services/          # API service (axios)
│   └── ...
├── docs/                      # Documentation
└── .github/workflows/ci.yml   # CI workflow
```
