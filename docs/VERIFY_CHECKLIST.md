# Verification Checklist

Final acceptance checklist with exact endpoints and expected responses.

## Auth

| # | Test | Endpoint | Expected |
|---|---|---|---|
| 1 | Login as admin | `POST /api/auth/login` `{"email":"admin@vsics.test","password":"AdminPass123"}` | `200` `{ token, user: { role: "admin" } }` |
| 2 | Login as faculty | `POST /api/auth/login` `{"email":"faculty@vsics.test","password":"FacultyPass123"}` | `200` `{ token, user: { role: "faculty" } }` |
| 3 | Login as student | `POST /api/auth/login` `{"email":"student1@vsics.test","password":"StudentPass123"}` | `200` `{ token, user: { role: "student" } }` |
| 4 | Register new user | `POST /api/auth/register` `{"name":"Test","email":"test@x.com","password":"123456"}` | `201` |
| 5 | Duplicate register | Same as #4 | `409` |
| 6 | Missing fields | `POST /api/auth/register` `{"email":"x@x.com"}` | `400` |

## Role Middleware

| # | Test | Expected |
|---|---|---|
| 7 | GET `/api/resources` without token | `401` |
| 8 | POST `/api/resources` with student token | `403` |
| 9 | POST `/api/resources` with faculty token | `201` (with title) |

## Resources

| # | Test | Expected |
|---|---|---|
| 10 | POST `/api/resources` with file + title | `201` |
| 11 | GET `/api/resources` | `200` array |
| 12 | GET `/api/resources?type=note` | `200` filtered |
| 13 | GET `/api/resources/:id` | `200` object |

## Attendance

| # | Test | Expected |
|---|---|---|
| 14 | POST `/api/attendance/mark` with valid records | `200` |
| 15 | POST `/api/attendance/mark` again (upsert) | `200` (no error) |
| 16 | GET `/api/attendance/student/3` | `200` `{ percentages, records }` |
| 17 | GET `/api/attendance/subject/1/date/2026-02-20` | `200` array |

## Assignments + Submissions

| # | Test | Expected |
|---|---|---|
| 18 | POST `/api/assignments` (faculty) | `201` |
| 19 | GET `/api/assignments` | `200` array |
| 20 | POST `/api/assignments/1/submit` (student + file) | `201` |
| 21 | GET `/api/assignments/1/submissions` (faculty) | `200` array |

## Placements + Notices

| # | Test | Expected |
|---|---|---|
| 22 | POST `/api/placements` (admin/faculty) | `201` |
| 23 | GET `/api/placements` | `200` array |
| 24 | POST `/api/notices` (admin/faculty) | `201` |
| 25 | GET `/api/notices` | `200` array |

## External Courses

| # | Test | Expected |
|---|---|---|
| 26 | POST `/api/external-courses` (faculty) | `201` |
| 27 | GET `/api/external-courses` | `200` array |
| 28 | POST `/api/external-courses/1/enroll` (student) | `201` |
| 29 | POST `/api/external-courses/1/upload-certificate` (student + file) | `200` |

## Infrastructure

| # | Check | Expected |
|---|---|---|
| 30 | `npm run migrate` | DB created, tables exist, seed data inserted |
| 31 | `cd backend && npm run dev` | Server starts on port 5000 |
| 32 | `cd frontend && npm run dev` | Vite dev server starts |
| 33 | `cd backend && npm test` | All tests pass |
| 34 | `docs/` folder exists | 7 files present |
| 35 | Branch is `fix/complete-features` | `git branch --show-current` |
