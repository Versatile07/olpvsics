# Architecture

## System Overview

```
┌─────────────┐     HTTP/REST     ┌─────────────────┐     mysql2     ┌───────┐
│   Frontend   │ ◄──────────────► │     Backend      │ ◄───────────► │ MySQL │
│  (Vite+React)│   JSON + JWT     │  (Node+Express)  │   Pool        │  DB   │
│  Port 5173   │                  │    Port 5000     │               │       │
└─────────────┘                   └─────────────────┘               └───────┘
                                        │
                                   ┌────┴────┐
                                   │ uploads/ │  (local file storage)
                                   └─────────┘
```

## Tech Stack

| Layer      | Technology                      |
|------------|----------------------------------|
| Frontend   | React 19, Vite 7, React Router 7, Axios, Tailwind CSS |
| Backend    | Node.js, Express 5, ES Modules  |
| Database   | MySQL 8+ via mysql2/promise     |
| Auth       | bcrypt + jsonwebtoken (JWT 7d)  |
| Uploads    | multer (local disk)             |
| Validation | express-validator               |
| Testing    | Jest + Supertest (backend), Vitest (frontend) |

## Backend Route Map

| Method | Endpoint                                     | Auth      | Role           |
|--------|----------------------------------------------|-----------|----------------|
| POST   | `/api/auth/register`                         | No        | —              |
| POST   | `/api/auth/login`                            | No        | —              |
| POST   | `/api/resources`                             | Yes       | faculty, admin |
| GET    | `/api/resources`                             | Yes       | any            |
| GET    | `/api/resources/:id`                         | Yes       | any            |
| POST   | `/api/attendance/mark`                       | Yes       | faculty, admin |
| GET    | `/api/attendance/student/:student_id`        | Yes       | any            |
| GET    | `/api/attendance/subject/:id/date/:date`     | Yes       | any            |
| POST   | `/api/assignments`                           | Yes       | faculty, admin |
| GET    | `/api/assignments`                           | Yes       | any            |
| POST   | `/api/assignments/:id/submit`                | Yes       | student        |
| GET    | `/api/assignments/:id/submissions`           | Yes       | faculty, admin |
| POST   | `/api/placements`                            | Yes       | admin, faculty |
| GET    | `/api/placements`                            | Yes       | any            |
| POST   | `/api/notices`                               | Yes       | admin, faculty |
| GET    | `/api/notices`                               | Yes       | any            |
| POST   | `/api/external-courses`                      | Yes       | faculty, admin |
| GET    | `/api/external-courses`                      | Yes       | any            |
| POST   | `/api/external-courses/:id/enroll`           | Yes       | student        |
| POST   | `/api/external-courses/:id/upload-certificate`| Yes      | student        |

## Database Schema (ER Summary)

```
departments ──< users ──< resources
                  │          ▲
                  │          │ (uploader_id)
                  ├──< attendance
                  ├──< assignments ──< submissions
                  ├──< placements
                  ├──< notices
                  ├──< courses_external ──< enrollments_external
                  └──< enrollments_external (student_id)
```

### Tables
- **departments** — Academic departments
- **users** — All users (admin, faculty, student) with bcrypt-hashed passwords
- **subjects** — Course subjects linked to departments
- **resources** — Notes and papers (file or URL)
- **attendance** — Per-student, per-subject, per-date records (UNIQUE constraint)
- **assignments** — Faculty-created assignments with deadlines
- **submissions** — Student file submissions for assignments
- **placements** — Job/internship postings
- **notices** — Announcements
- **courses_external** — External course listings
- **enrollments_external** — Student enrollments with certificate tracking

## Frontend ↔ Backend Mapping

| Frontend Page       | Component File                | API Endpoints Called                    |
|---------------------|-------------------------------|----------------------------------------|
| Login               | `pages/Login.jsx`             | `POST /api/auth/login`                 |
| Dashboard           | `pages/Dashboard.jsx`         | —                                      |
| Resources           | `pages/Resources.jsx`         | `GET /api/resources`                   |
| Upload Resource     | `pages/UploadResource.jsx`    | `POST /api/resources`                  |
| Attendance          | `pages/Attendance.jsx`        | `POST /api/attendance/mark`, `GET /api/attendance/student/:id` |
| Assignments         | `pages/Assignments.jsx`       | `GET/POST /api/assignments`, `POST /api/assignments/:id/submit` |
| Placements          | `pages/Placements.jsx`        | `GET /api/placements`                  |
| Notices             | `pages/Notices.jsx`           | `GET /api/notices`                     |
| External Courses    | `pages/ExternalCourses.jsx`   | `GET/POST /api/external-courses`, enroll, upload-certificate |
