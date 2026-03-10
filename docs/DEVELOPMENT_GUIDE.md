# Development Guide

## Branch Strategy

- `main` — Production-ready code
- `fix/complete-features` — Current development branch
- `feature/<name>` — New feature branches
- `fix/<name>` — Bug fix branches
- `release/vX.Y.Z` — Release branches

### Workflow
1. Create feature branch from `main`: `git checkout -b feature/my-feature`
2. Make changes with atomic commits
3. Push and create PR to `main`
4. Code review + CI passes → merge

## Commit Message Style

Format: `<type>: <description>`

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, refactoring |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `ci` | CI/CD changes |

Examples:
- `feat: add external courses module`
- `fix: attendance duplicate prevention`
- `docs: update README`

## Running Migrations

```bash
cd backend
npm run migrate
```
This creates the `olpvsics` database, all tables, and inserts seed data (admin, faculty, students).

**Seed credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@vsics.test | AdminPass123 |
| Faculty | faculty@vsics.test | FacultyPass123 |
| Student | student1@vsics.test | StudentPass123 |
| Student | student2@vsics.test | StudentPass123 |

## Starting Development Servers

### Backend
```bash
cd backend
cp .env.example .env  # Edit with your DB credentials
npm install
npm run dev
```
Runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Adding New Features

### New API Endpoint
1. Create controller in `backend/src/controllers/<name>Controller.js`
2. Create route in `backend/src/routes/<name>.js`
3. Register route in `backend/src/routes/index.js`
4. Add validation rules in `backend/src/middleware/validate.js` (optional)
5. Add tests in `backend/test/<name>.test.js`

### New Frontend Page
1. Create page in `frontend/src/pages/<Name>.jsx`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/pages/Dashboard.jsx`

### New Database Table
1. Create migration file: `backend/db/migrations/003_<name>.sql`
2. Update `backend/db/migrate.js` if needed
3. Run migration: `npm run migrate`

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npx vitest run
```
