# Deployment Guide for HRM Application

## Quick Deploy Options

### 1. Vercel (Frontend + API Routes)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### 2. Railway (Full Stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### 3. Heroku (Traditional)
```bash
# Install Heroku CLI
# Create Procfile: web: npm run start

# Deploy
heroku create your-hrm-app
git push heroku main
```

### 4. DigitalOcean App Platform
- Connect GitHub repository
- Configure build settings
- Add environment variables

## Environment Variables for Production

```env
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=production
PORT=5000
```

## Database Setup

### Option 1: Neon (Serverless PostgreSQL)
1. Visit [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update DATABASE_URL

### Option 2: Railway PostgreSQL
```bash
railway add postgresql
```

### Option 3: Supabase
1. Visit [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from settings

## Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Update CORS settings if needed
- [ ] Set up error monitoring (Sentry)
- [ ] Configure logging
- [ ] Set up backups
- [ ] SSL/HTTPS configuration
- [ ] Performance monitoring

## Build Commands

```bash
# Install dependencies
npm ci

# Build frontend
npm run build

# Start production server
npm run start
```