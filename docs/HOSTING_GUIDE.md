# Hosting & Deployment Guide

## Recommended Free Hosting Options

### Option 1: Railway (Easiest — All-in-One)

**Best for**: Quick deployment with minimal setup

1. **Sign up** at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. **Create 3 services**:
   - **MySQL** — Add a MySQL plugin (auto-provisions)
   - **Backend** — Point to `/backend`, set start command: `npm start`
   - **Frontend** — Point to `/frontend`, set build command: `npm run build`, output: `dist`

4. **Set environment variables** on the backend service:
   ```
   DB_HOST=<railway-mysql-host>
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=olpvsics
   JWT_SECRET=<generate-a-random-64-char-string>
   PORT=5000
   ```

5. **Set frontend env**:
   ```
   VITE_API_BASE_URL=https://<your-backend>.railway.app/api
   ```

6. **Run migration** via Railway console:
   ```bash
   npm run migrate
   ```

**Cost**: Free tier gives $5/month credit (enough for small projects).

---

### Option 2: Vercel (Frontend) + Render (Backend + DB)

**Best for**: Production-grade free hosting

#### Frontend on Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add env variable: `VITE_API_BASE_URL=https://<your-backend>.onrender.com/api`
7. Deploy

#### Backend on Render
1. Sign up at [render.com](https://render.com)
2. Create a **Web Service** from your GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT)
7. Deploy

#### MySQL Database
- Use **PlanetScale** (free tier): [planetscale.com](https://planetscale.com)
- Or **Aiven** (free tier): [aiven.io](https://aiven.io)
- Or **Railway** MySQL add-on
- Copy the connection details to your Render backend env vars

---

### Option 3: DigitalOcean App Platform

**Best for**: Affordable managed hosting

1. Sign up at [digitalocean.com](https://digitalocean.com)
2. Create an **App** from your GitHub repo
3. Add two components:
   - **Backend**: Source directory `/backend`, run command `npm start`
   - **Frontend**: Source directory `/frontend`, build command `npm run build`, output `dist`
4. Add a **Managed MySQL Database** ($15/mo) or use external free MySQL
5. Set environment variables
6. Deploy

**Cost**: Starts at $5/mo

---

### Option 4: AWS (Most Scalable)

**Best for**: Large-scale, production deployment

| Component | AWS Service | Cost |
|---|---|---|
| Frontend | S3 + CloudFront | ~$1/mo |
| Backend | EC2 t2.micro or Elastic Beanstalk | Free tier 12 months |
| Database | RDS MySQL (db.t3.micro) | Free tier 12 months |
| File Storage | S3 bucket | ~$0.02/GB |

#### Steps
1. Create an RDS MySQL instance
2. Deploy backend to EC2 or Elastic Beanstalk
3. Build frontend (`npm run build`) and upload `dist/` to S3
4. Set up CloudFront for CDN
5. Configure environment variables on EC2

---

## Pre-Deployment Checklist

Before deploying to any platform:

- [ ] Generate a strong JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Change default seed passwords in `002_seed.sql` or delete seed data
- [ ] Update `VITE_API_BASE_URL` in frontend to point to your deployed backend
- [ ] Set `CORS` origin in `backend/src/app.js` to your frontend domain:
  ```js
  app.use(cors({ origin: 'https://your-frontend-domain.com' }));
  ```
- [ ] Create `backend/uploads/` directory on the server or switch to cloud storage (S3/Cloudinary)
- [ ] Run `npm run migrate` on the server to set up the database
- [ ] Verify all endpoints work with the deployed backend URL

## File Upload Storage for Production

The current setup uses **local disk storage** (`backend/uploads/`). For production, switch to cloud storage:

### Cloudinary
```bash
npm install multer-storage-cloudinary cloudinary
```
Update `backend/src/middleware/upload.js` — swap the `storage` config.

### AWS S3
```bash
npm install multer-s3 @aws-sdk/client-s3
```
Update `backend/src/middleware/upload.js` — swap the `storage` config.

Both options are marked with `// TODO` comments in the upload middleware.
