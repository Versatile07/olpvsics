# Linux Setup Guide

> Run the project on Ubuntu, Debian, Fedora, Arch, or any Linux distro.

---

## Prerequisites

| Software | Version | Install |
|---|---|---|
| Node.js | v18+ | `sudo apt install nodejs npm` or [nvm](https://github.com/nvm-sh/nvm) |
| MySQL | v8.0+ | `sudo apt install mysql-server` |
| Git | any | `sudo apt install git` |

---

## Quick Setup (One Command)

```bash
git clone <your-repo-url>
cd olpvsics
chmod +x setup.sh
./setup.sh
```

The script will:
1. Check Node.js and MySQL are available
2. Copy `.env.example` → `.env` for both backend and frontend
3. Create the `uploads/` directory with correct permissions
4. Run `npm install` for backend and frontend
5. Run database migrations + seed real accounts

---

## Manual Setup

### 1. Clone & configure

```bash
git clone <your-repo-url>
cd olpvsics

# Backend env
cp backend/.env.example backend/.env
nano backend/.env    # Set DB_PASSWORD and JWT_SECRET

# Frontend env (optional — defaults work for local dev)
cp frontend/.env.example frontend/.env
```

### 2. MySQL — create user (optional, root also works)

```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE IF NOT EXISTS olpvsics;
CREATE USER 'vsics'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON olpvsics.* TO 'vsics'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Then update `backend/.env` with the `vsics` user credentials.

### 3. Install dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 4. Run migrations (creates tables + seeds all accounts)

```bash
cd backend
npm run migrate
```

### 5. Start both servers

Open two terminals:

```bash
# Terminal 1 — Backend  (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend  (http://localhost:5173)
cd frontend
npm run dev
```

---

## File Permissions

The backend saves uploaded files in `backend/uploads/`. Ensure the process user has write access:

```bash
chmod 755 backend/uploads
```

If running as a service (systemd), ensure the service user owns the directory:

```bash
chown -R www-data:www-data backend/uploads   # if running as www-data
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests mock the database, so no running MySQL is needed for unit tests.

---

## Production on Linux (systemd)

Create `/etc/systemd/system/vsics-backend.service`:

```ini
[Unit]
Description=VSICS Backend Server
After=network.target mysql.service

[Service]
Type=simple
User=vsics
WorkingDirectory=/opt/olpvsics/backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable vsics-backend
sudo systemctl start vsics-backend
sudo systemctl status vsics-backend
```

For the frontend, build and serve with Nginx:

```bash
cd frontend && npm run build
# Copy dist/ to your Nginx webroot
sudo cp -r dist/* /var/www/html/vsics/
```

---

## Troubleshooting on Linux

| Issue | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | `sudo systemctl start mysql` |
| `Permission denied: ./uploads` | `chmod 755 backend/uploads` |
| Port 5000 in use | `lsof -ti:5000 | xargs kill` |
| Port 5173 in use | `lsof -ti:5173 | xargs kill` |
| `node: command not found` | Install via nvm or `sudo apt install nodejs` |
| Line ending issues after clone | `git config --global core.autocrlf input` |
