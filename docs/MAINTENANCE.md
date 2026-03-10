# Maintenance Guide

## Common Maintenance Tasks

### Rotate JWT Secret
1. Generate new secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. Update `JWT_SECRET` in `backend/.env`
3. Restart backend — all existing tokens will be invalidated

### Database Backup
```bash
# Full backup
mysqldump -u root -p olpvsics > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p olpvsics < backup_20260311.sql
```

### Database Restore
```bash
mysql -u root -p < backup_file.sql
```

### Re-run Migrations (reset DB)
```bash
cd backend
npm run migrate
```
> ⚠️ This drops and recreates all tables. Back up first!

### Add a New Release
1. Create branch: `git checkout -b release/vX.Y.Z`
2. Update version in `package.json`
3. Run tests: `npm test`
4. Merge to main: `git checkout main && git merge release/vX.Y.Z`
5. Tag: `git tag vX.Y.Z && git push --tags`

### Clear Upload Directory
```bash
# Remove old uploads (older than 30 days)
find backend/uploads -type f -mtime +30 -delete
```

## Logs to Check
- **Backend console** — `npm run dev` outputs request logs and errors
- **MySQL logs** — Check slow query log for performance issues
- **Upload directory** — Monitor disk space in `backend/uploads/`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | 5000 |
| `DB_HOST` | MySQL host | 127.0.0.1 |
| `DB_USER` | MySQL user | root |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | olpvsics |
| `JWT_SECRET` | JWT signing secret | — |
| `UPLOAD_DIR` | File upload directory | ./uploads |
| `VITE_API_BASE_URL` | Frontend API base URL | http://localhost:5000/api |

## Monitoring Checklist
- [ ] Database connection pool not exhausted (default: 10 connections)
- [ ] Upload directory disk space sufficient
- [ ] JWT secret rotated periodically
- [ ] Database backups running on schedule
- [ ] No unhandled promise rejections in backend logs
