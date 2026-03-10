# Test Plan

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```
Uses `jest --runInBand` with `--experimental-vm-modules` for ES module support. Tests mock the database pool so no MySQL connection is needed.

### Frontend Tests
```bash
cd frontend
npx vitest run
```

## Backend Test Suite

| Test File | Tests | Description |
|---|---|---|
| `test/auth.test.js` | 4 tests | Register (success, duplicate, missing fields), Login (success, invalid) |
| `test/roles.test.js` | 4 tests | No token → 401, student blocked → 403, faculty allowed, invalid token → 401 |
| `test/resources.test.js` | 2 tests | GET list, POST create resource |
| `test/attendance.test.js` | 4 tests | Mark success, invalid payload, duplicate upsert, GET student data |

## Frontend Test Suite

| Test File | Tests | Description |
|---|---|---|
| `src/__tests__/Login.test.jsx` | 2 tests | Renders login form, calls login service |
| `src/__tests__/RequireAuth.test.jsx` | 1 test | Blocks unauthenticated users |

## Manual Test Steps (curl)

### Auth Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vsics.test","password":"AdminPass123"}'
# Expected: 200 with { token, user }
```

### Auth Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@test.com","password":"Test1234"}'
# Expected: 201
```

### Resource Upload (faculty token)
```bash
TOKEN="<faculty_jwt>"
curl -X POST http://localhost:5000/api/resources \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Note" -F "subject_id=1" -F "type=note" -F "file=@./test.pdf"
# Expected: 201
```

### List Resources
```bash
curl http://localhost:5000/api/resources \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 with array
```

### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject_id":1,"date":"2026-02-20","records":[{"student_id":3,"status":"present"}]}'
# Expected: 200
```

### Create Assignment
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Assignment","subject_id":1,"deadline":"2026-03-01T23:59:00"}'
# Expected: 201
```

### Submit Assignment (student token)
```bash
STUDENT_TOKEN="<student_jwt>"
curl -X POST http://localhost:5000/api/assignments/1/submit \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "file=@./answer.pdf"
# Expected: 201
```

### List Placements
```bash
curl http://localhost:5000/api/placements -H "Authorization: Bearer $TOKEN"
# Expected: 200
```

### List External Courses
```bash
curl http://localhost:5000/api/external-courses -H "Authorization: Bearer $TOKEN"
# Expected: 200
```
