# GrowthOS - Manual Deployment Guide (Render)

This guide provides step-by-step instructions to deploy GrowthOS to Render manually. This is the most reliable method.

## Prerequisites
- Render account at [dashboard.render.com](https://dashboard.render.com)
- GitHub repository: https://github.com/Alokjha16/GrowthOs

---

## Step 1: Deploy PostgreSQL Database

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in the form:
   - **Name**: `growthos-postgres`
   - **Database**: `growthos`
   - **User**: `postgres`
   - **Plan**: Free
   - **Region**: (choose nearest to you)
5. Click **"Create Database"**
6. **IMPORTANT**: Wait for it to be "Live" (2-3 minutes)
7. **Copy the Internal Database URL**:
   - Click on the `growthos-postgres` service
   - Scroll down to "Connections"
   - Copy the **Internal Database URL**
   - It looks like: `postgres://postgres:xxx@growthos-postgres.xxx.render.com:5432/growthos`
   - **Save this URL** - you'll need it for backend and frontend

---

## Step 2: Deploy Spring Boot Backend

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** and authorize
3. Select repository: **Alokjha16/GrowthOs**
4. Fill in the form:
   - **Name**: `growthos-backend`
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Docker Context**: `.`
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Plan**: Free
   - **Region**: (same as PostgreSQL)
5. Scroll down to **"Environment Variables"**
6. Add the following variables (click "Add Environment Variable" for each):

   ```
   PORT = 8080
   SPRING_PROFILES_ACTIVE = prod
   SPRING_DATASOURCE_URL = [paste your PostgreSQL Internal URL from Step 1]
   SPRING_DATASOURCE_USERNAME = postgres
   SPRING_DATASOURCE_PASSWORD = [the password from your PostgreSQL URL]
   SPRING_JPA_DATABASE_PLATFORM = org.hibernate.dialect.PostgreSQLDialect
   SPRING_JPA_HIBERNATE_DDL_AUTO = update
   ```

   **Example** (replace with your actual URL):
   ```
   SPRING_DATASOURCE_URL = postgres://postgres:abc123@growthos-postgres.a1b2c3d4.render.com:5432/growthos
   SPRING_DATASOURCE_PASSWORD = abc123
   ```

7. Click **"Create Web Service"**
8. Wait for deployment (~5-7 minutes)
9. Verify it's "Live" before proceeding

---

## Step 3: Deploy Next.js Frontend

1. Click **"New +"** → **"Web Service"**
2. Your GitHub repo should already be connected
3. Select repository: **Alokjha16/GrowthOs**
4. Fill in the form:
   - **Name**: `growthos-frontend`
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Docker Context**: `.`
   - **Dockerfile Path**: `./Dockerfile.frontend`
   - **Plan**: Free
   - **Region**: (same as PostgreSQL and backend)
5. Scroll down to **"Environment Variables"**
6. Add the following variables:

   ```
   PORT = 3000
   DATABASE_URL = [paste your PostgreSQL Internal URL from Step 1]
   DIRECT_URL = [paste your PostgreSQL Internal URL from Step 1]
   NEXT_PUBLIC_APP_NAME = GrowthOS
   NEXT_PUBLIC_APP_URL = https://growthos-frontend.onrender.com
   NEXTAUTH_URL = https://growthos-frontend.onrender.com
   NEXTAUTH_SECRET = generate-a-random-secret-key-here
   ```

   **To generate NEXTAUTH_SECRET**, run this in your terminal:
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string like: `my-secret-key-12345`

7. Click **"Create Web Service"**
8. Wait for deployment (~5-7 minutes)

---

## Step 4: Initialize Database Schema

After the frontend is deployed and "Live":

1. Go to the `growthos-frontend` service in Render
2. Click the **"Shell"** tab (top)
3. Wait for the shell to connect
4. Run this command:
   ```bash
   npx prisma db push
   ```
5. This will create all the database tables
6. Once done, you can close the shell

---

## Step 5: Access Your Application

Once all three services are "Live":

- **Frontend URL**: `https://growthos-frontend.onrender.com`
- **Backend API**: `https://growthos-backend.onrender.com`
- **Backend Health Check**: `https://growthos-backend.onrender.com/api/health`
- **Swagger UI**: `https://growthos-backend.onrender.com/swagger-ui/index.html`

---

## Troubleshooting

### Backend fails to start
- Check logs in Render dashboard
- Verify PostgreSQL connection string is correct
- Ensure PostgreSQL is "Live" before deploying backend
- Check that `SPRING_DATASOURCE_PASSWORD` matches your PostgreSQL password

### Frontend fails to build
- Check that DATABASE_URL is set correctly
- Verify the PostgreSQL service is accessible
- Check build logs for errors

### Database connection errors
- Ensure all services are in the same region
- Verify the Internal Database URL is correct
- Check that PostgreSQL service is "Live"

### Prisma errors
- Make sure DATABASE_URL format is correct
- Run `npx prisma db push` in the frontend shell
- Check Prisma schema in `frontend/prisma/schema.prisma`

---

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- Cold start takes ~30 seconds
- PostgreSQL free tier is valid for 90 days
- After 90 days, you'll need to upgrade to a paid plan

### Environment Variables
- **NEVER** commit actual passwords to GitHub
- Always use Render's environment variables
- Generate a secure NEXTAUTH_SECRET for production

### Monitoring
- Check logs regularly in Render dashboard
- Monitor service health
- Set up alerts if you upgrade to paid plans

---

## Next Steps After Deployment

1. **Test the application**
   - Visit frontend URL
   - Test backend API via Swagger UI
   - Check health endpoint

2. **Configure custom domain** (optional)
   - Go to each service
   - Settings → Custom Domains
   - Add your domain

3. **Set up CI/CD** (optional)
   - Render auto-deploys on git push
   - Configure branch rules if needed

4. **Backup database** (important for production)
   - PostgreSQL backups are automatic on paid plans
   - Consider setting up regular exports

5. **Upgrade to paid plans** (for production)
   - PostgreSQL: ~$7/month
   - Web services: ~$7/month each
   - Total: ~$21/month for production

---

## Support

If you encounter issues:
1. Check Render service logs
2. Verify all environment variables
3. Ensure services are in the same region
4. Review this guide carefully
5. Check Render documentation: https://render.com/docs

---

## Cost Summary

**Free Tier (Current):**
- PostgreSQL: Free (90 days)
- Backend: Free (with spin-down)
- Frontend: Free (with spin-down)
- **Total: $0/month** (initially)

**Paid Tier (Production):**
- PostgreSQL: ~$7/month
- Backend: ~$7/month
- Frontend: ~$7/month
- **Total: ~$21/month**

---

**That's it! Follow these steps and your GrowthOS will be deployed successfully.** 🚀
