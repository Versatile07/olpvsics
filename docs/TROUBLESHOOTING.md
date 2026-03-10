# Troubleshooting

## DB Connection Refused
**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Fix**:
1. Verify MySQL is running: `sudo systemctl status mysql` (Linux) or check Services (Windows)
2. Check `backend/.env` credentials match your MySQL setup
3. Test connection: `mysql -u root -p -h 127.0.0.1`
4. If using Docker: ensure port 3306 is mapped

**Fallback**: Run SQL manually:
```bash
mysql -u root -p < backend/db/migrations/001_schema.sql
mysql -u root -p olpvsics < backend/db/migrations/002_seed.sql
```

## JWT Invalid / Token Errors
**Symptom**: `401 Invalid or expired token`

**Fix**:
1. Ensure `JWT_SECRET` in `.env` matches what was used to sign the token
2. Token may have expired (7-day expiry) — re-login
3. Check `Authorization: Bearer <token>` header format (note the space after "Bearer")
4. Don't include quotes around the token value

## File Upload Not Saving
**Symptom**: `POST /api/resources` returns 400 or file is missing

**Fix**:
1. Ensure `backend/uploads/` directory exists: `mkdir -p backend/uploads`
2. Check file is sent as `multipart/form-data` with field name `file`
3. Verify file type is allowed (pdf, doc, docx, ppt, pptx, jpg, jpeg, png, zip)
4. Check file size is under 10MB limit
5. For curl: use `-F "file=@./myfile.pdf"` (not `-d`)

## Duplicate Attendance Insertion
**Symptom**: `ER_DUP_ENTRY` or `Duplicate entry`

**Fix**: This is handled by the UNIQUE constraint `uniq_attendance (subject_id, date, student_id)`. The API uses `INSERT ... ON DUPLICATE KEY UPDATE` for upserts, so re-marking attendance for the same student/date/subject will update the existing record rather than fail.

If you get this error, it means you're calling the DB directly instead of through the API.

## CORS Errors
**Symptom**: Browser console shows `Access-Control-Allow-Origin` errors

**Fix**:
1. Backend uses `app.use(cors())` which allows all origins (dev mode)
2. For production, configure CORS with specific origins:
   ```js
   app.use(cors({ origin: 'https://yourdomain.com' }));
   ```
3. Ensure the backend is running on the expected port (5000)
4. Check `VITE_API_BASE_URL` in frontend `.env` matches backend URL

## Backend Won't Start
**Symptom**: `Error: Cannot find module` or startup crash

**Fix**:
1. Run `cd backend && npm install`
2. Ensure `.env` file exists (copy from `.env.example`)
3. Ensure MySQL is running and credentials are correct
4. Check Node.js version ≥ 18 (ES modules required)

## Frontend Build Errors
**Symptom**: Vite build or dev server fails

**Fix**:
1. Run `cd frontend && npm install`
2. Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:5000/api`
3. Clear Vite cache: `rm -rf frontend/node_modules/.vite`
4. Ensure Node.js version ≥ 18

## Tests Failing
**Symptom**: `npm test` shows failures

**Fix**:
1. Tests mock the database — no MySQL connection needed
2. Ensure `--experimental-vm-modules` flag is in the test script
3. Run tests in band: `npm test -- --runInBand`
4. Check for port conflicts (tests use ports 5001-5004)
