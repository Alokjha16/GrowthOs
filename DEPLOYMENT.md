# GrowthOS Deployment Guide

This guide will help you deploy the GrowthOS project to Render using the pre-configured `render.yaml` file.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Account**: Push your code to GitHub
3. **Git**: Installed on your local machine

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
cd c:\Users\alokj\Downloads\GrowthOS-Project\GrowthOS-Project

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - GrowthOS with Render configuration"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. **Log in to Render** at [dashboard.render.com](https://dashboard.render.com)

2. **Create a New Web Service**:
   - Click "New +" button
   - Select "Blueprint" (this will use your `render.yaml` file)
   - Connect your GitHub repository
   - Select the repository you just pushed
   - Render will automatically detect the `render.yaml` file
   - Review the configuration and click "Apply"

3. **Alternative: Manual Deployment** (if Blueprint doesn't work):

   **A. Deploy PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `growthos-postgres`
   - Database: `growthos`
   - User: `postgres`
   - Plan: Free
   - Click "Create Database"

   **B. Deploy Spring Boot Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `growthos-backend`
   - Runtime: Docker
   - Docker Context: `./backend`
   - Dockerfile Path: `./backend/Dockerfile`
   - Environment Variables:
     ```
     PORT=8080
     SPRING_PROFILES_ACTIVE=prod
     SPRING_DATASOURCE_URL=postgresql://postgres:PASSWORD@growthos-postgres.render.com:5432/growthos
     SPRING_DATASOURCE_USERNAME=postgres
     SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
     SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
     SPRING_JPA_HIBERNATE_DDL_AUTO=update
     ```
   - Click "Create Web Service"

   **C. Deploy Next.js Frontend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `growthos-frontend`
   - Runtime: Docker
   - Docker Context: `./frontend`
   - Dockerfile Path: `./frontend/Dockerfile`
   - Environment Variables:
     ```
     PORT=3000
     DATABASE_URL=postgresql://postgres:PASSWORD@growthos-postgres.render.com:5432/growthos
     DIRECT_URL=postgresql://postgres:PASSWORD@growthos-postgres.render.com:5432/growthos
     NEXT_PUBLIC_APP_NAME=GrowthOS
     NEXT_PUBLIC_APP_URL=https://growthos-frontend.onrender.com
     NEXTAUTH_URL=https://growthos-frontend.onrender.com
     NEXTAUTH_SECRET=generate-a-random-secret-key
     ```
   - Click "Create Web Service"

### Step 3: Wait for Deployment

- Render will automatically build and deploy your services
- This typically takes 5-10 minutes for the first deployment
- Monitor the deployment logs in the Render dashboard

### Step 4: Access Your Application

Once deployment is complete:

- **Frontend URL**: `https://growthos-frontend.onrender.com`
- **Backend API**: `https://growthos-backend.onrender.com`
- **Backend Swagger UI**: `https://growthos-backend.onrender.com/swagger-ui/index.html`
- **API Health Check**: `https://growthos-backend.onrender.com/api/health`

### Step 5: Run Database Migrations

The frontend application needs to initialize the database schema:

1. Once the frontend is deployed, access the Render dashboard
2. Go to the `growthos-frontend` service
3. Click "Shell" tab
4. Run:
   ```bash
   npx prisma db push
   ```

Or add a build script to your package.json to run this automatically during deployment.

## Important Notes

### Environment Variables

- **NEXTAUTH_SECRET**: Generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```

- **Database Password**: Use the password from your PostgreSQL service in Render

### Free Tier Limitations

Render's free tier has the following limitations:
- Services spin down after 15 minutes of inactivity
- Cold start takes ~30 seconds
- PostgreSQL free tier: 90 days, then you need to upgrade
- Limited resources (512MB RAM, 0.1 CPU)

For production use, consider upgrading to paid plans.

### Troubleshooting

**Backend Fails to Start:**
- Check logs in Render dashboard
- Ensure PostgreSQL connection string is correct
- Verify database is accessible

**Frontend Build Fails:**
- Check if all dependencies are in package.json
- Verify Prisma schema is valid
- Ensure DATABASE_URL is set correctly

**Database Connection Issues:**
- Wait for PostgreSQL to be fully deployed before deploying backend/frontend
- Check firewall settings in Render
- Verify connection string format

## Alternative: Local Deployment with Docker

If you have Docker installed locally, you can run the entire stack locally:

```bash
cd c:\Users\alokj\Downloads\GrowthOS-Project\GrowthOS-Project
docker compose up -d --build
```

This will start:
- PostgreSQL on port 5432
- Spring Boot Backend on port 8080
- Next.js Frontend on port 3000

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

## Support

If you encounter issues:
1. Check Render service logs
2. Review deployment errors in the Render dashboard
3. Ensure all environment variables are set correctly
4. Verify database connectivity

## Cost Estimate

**Render Free Tier:**
- PostgreSQL: Free (90 days)
- Web Services: Free (with spin-down)
- Total: $0/month (initially)

**Render Paid Tier (recommended for production):**
- PostgreSQL: ~$7/month
- Web Services: ~$7/month each
- Total: ~$21/month

## Next Steps After Deployment

1. Run database migrations/seeds
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Enable SSL (automatically provided by Render)
5. Configure backup for PostgreSQL
6. Set up CI/CD pipeline for automatic deployments
