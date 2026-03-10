# Component Map

Map of each code file/folder → affected feature → how to modify it.

## Backend

| File/Folder | Feature | To Change |
|---|---|---|
| `backend/src/server.js` | App entry point | Only modify PORT or startup logic |
| `backend/src/app.js` | Express setup, CORS, middleware | Add new middleware or change CORS config here |
| `backend/src/routes/index.js` | Central router | Add new route modules here |
| `backend/src/routes/auth.js` | Auth routes | Add password reset, OAuth endpoints |
| `backend/src/routes/resources.js` | Resource CRUD routes | Add delete, update endpoints |
| `backend/src/routes/attendance.js` | Attendance routes | Add bulk export, report endpoints |
| `backend/src/routes/assignments.js` | Assignment + submission routes | Add grading, deadline extension |
| `backend/src/routes/placements.js` | Placement routes | Add application tracking |
| `backend/src/routes/notices.js` | Notice routes | Add expiry, priority filters |
| `backend/src/routes/externalCourses.js` | External course routes | Add review, rating features |
| `backend/src/controllers/authController.js` | Register/Login logic | JWT expiry, OAuth, password rules |
| `backend/src/controllers/resourceController.js` | Resource CRUD | File type validation, S3 swap |
| `backend/src/controllers/attendanceController.js` | Attendance marking + queries | Upsert logic, percentage calc |
| `backend/src/controllers/assignmentController.js` | Assignment management | Add deadline enforcement |
| `backend/src/controllers/submissionController.js` | Student submissions | Add re-submission, grading |
| `backend/src/controllers/placementController.js` | Placement postings | Add applications table |
| `backend/src/controllers/noticeController.js` | Notice management | Add role-based visibility |
| `backend/src/controllers/externalCourseController.js` | External courses | Certificate verification |
| `backend/src/middleware/auth.js` | JWT verification | Change secret, add refresh tokens |
| `backend/src/middleware/roles.js` | Role authorization | Add new roles |
| `backend/src/middleware/upload.js` | File upload (multer) | Swap to Cloudinary/S3 |
| `backend/src/middleware/validate.js` | Input validation rules | Add rules for new endpoints |
| `backend/src/models/userModel.js` | User DB queries | Add profile update, search |
| `backend/db/index.js` | DB connection pool | Change pool size, add SSL |
| `backend/db/migrate.js` | Migration runner | Add rollback support |
| `backend/db/migrations/001_schema.sql` | Full schema | Add new tables / columns |
| `backend/db/migrations/002_seed.sql` | Seed data | Add more test data |

## Frontend

| File/Folder | Feature | To Change |
|---|---|---|
| `frontend/src/App.jsx` | Router + AuthProvider | Add new routes |
| `frontend/src/main.jsx` | React root render | Add global providers |
| `frontend/src/context/AuthContext.jsx` | Auth state management | Add profile, preferences |
| `frontend/src/services/api.js` | Axios instance | Change base URL, add retry |
| `frontend/src/components/RequireAuth.jsx` | Auth guard | Add redirect URL memory |
| `frontend/src/components/RequireRole.jsx` | Role guard | Add permission-based guards |
| `frontend/src/pages/Login.jsx` | Login form | Add registration, OAuth |
| `frontend/src/pages/Dashboard.jsx` | Role-based dashboard | Add widgets, stats |
| `frontend/src/pages/Resources.jsx` | Resource listing | Add pagination, search |
| `frontend/src/pages/UploadResource.jsx` | File upload form | Add drag-drop, preview |
| `frontend/src/pages/Attendance.jsx` | Attendance mark + view | Add calendar view |
| `frontend/src/pages/Assignments.jsx` | Assignment CRUD + submit | Add grading UI |
| `frontend/src/pages/Placements.jsx` | Placement listings | Add apply button |
| `frontend/src/pages/Notices.jsx` | Notice board | Add create form for admin |
| `frontend/src/pages/ExternalCourses.jsx` | External courses | Add progress tracking |
