# 🚂 Railway Deployment Guide for linkr Backend

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with your GitHub account (writetosagnik)

## Step 2: Deploy Backend
1. Click "Deploy from GitHub repo"
2. Select your repository: `writetosagnik/linkr`
3. Railway will ask which service to deploy
4. Choose "backend" folder or set root directory to `/backend`

## Step 3: Configure Deployment
Railway should auto-detect:
- ✅ Python application
- ✅ FastAPI framework
- ✅ Requirements.txt dependencies

## Step 4: Environment Variables (Optional)
No environment variables needed for basic deployment.

## Step 5: Get Your Railway URL
After deployment, Railway will provide a URL like:
`https://linkr-backend-production-xxxx.up.railway.app`

## Step 6: Update Frontend Environment Variable

Once you get the Railway URL, run these commands:

```bash
# Remove old Vercel backend URL
cd C:\Users\KIIT0001\Desktop\linkr
npx vercel env rm VITE_API_BASE_URL

# Add new Railway backend URL
npx vercel env add
# Name: VITE_API_BASE_URL
# Value: https://your-railway-url.up.railway.app

# Redeploy frontend
npx vercel --prod
```

## Step 7: Test Connection
Your new frontend will connect to the Railway backend, which should resolve the "failed to fetch" error!

## 🎯 Expected Railway URL Format:
`https://linkr-backend-production-xxxx.up.railway.app`

Replace "xxxx" with your actual Railway deployment ID.

## ✅ Advantages of Railway:
- Better Python/FastAPI support
- No authentication issues
- Automatic HTTPS
- Reliable CORS handling
- Free tier available
