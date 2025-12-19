# Deployment Guide - HackTrack AI

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Neon PostgreSQL database

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/hacktrack-ai.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Add Environment Variables

In Vercel project settings, add:

```
DATABASE_URL=your_neon_postgresql_connection_string
```

**Get your Neon connection string:**
1. Go to [neon.tech](https://neon.tech)
2. Select your project
3. Copy the connection string from dashboard
4. Format: `postgresql://user:password@host/database?sslmode=require`

### 4. Deploy

Click "Deploy" - Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to production

Your app will be live at: `https://your-project.vercel.app`

## Post-Deployment

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables for Different Environments
- **Production**: Set in Vercel dashboard
- **Preview**: Automatically uses production variables
- **Development**: Use local `.env` file

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set in Vercel
- Ensure Neon database is active
- Check connection string format

### Environment Variables Not Working
- Restart deployment after adding variables
- Ensure variable names match exactly (case-sensitive)
- Check for typos in connection string

## Monitoring

Vercel provides:
- **Analytics**: Track page views and performance
- **Logs**: View runtime logs and errors
- **Deployments**: History of all deployments

Access these in your Vercel project dashboard.

## Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push

# Vercel automatically deploys on push to main branch
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking setup
- [ ] Performance monitoring active

## Support

For issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
