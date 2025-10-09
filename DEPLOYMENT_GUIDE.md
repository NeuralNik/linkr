# 🚀 Deployment Guide - linkr

> Complete guide for deploying the linkr QR Code Generator (Frontend + Backend)

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Environment Variables](#environment-variables)
7. [Testing Deployment](#testing-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 Overview

linkr consists of two parts:
- **Frontend**: React + TypeScript + Vite (Deploy to Vercel)
- **Backend**: FastAPI + Python (Deploy to Render)

**Deployment Flow:**
```
1. Deploy Backend to Render → Get API URL
2. Configure Frontend with API URL
3. Deploy Frontend to Vercel
4. Test complete application
```

**Estimated Time:** 15-20 minutes

---

## ✅ Prerequisites

### Required:
- [x] GitHub account
- [x] [Render](https://render.com) account (free)
- [x] [Vercel](https://vercel.com) account (free)
- [x] Code pushed to GitHub repository

### Verify Your Setup:
```bash
# Check if code is committed
git status

# Check if pushed to GitHub
git remote -v
git log origin/main..HEAD  # Should show nothing if all pushed
```

---

## ⚡ Quick Start

### TL;DR - Fastest Deployment

**Backend (2 minutes):**
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub → Select repo
3. Settings: Root Dir: `backend`, Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy → Copy URL

**Frontend (2 minutes):**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Add env var: `VITE_API_URL=<your-render-url>`
4. Deploy → Done!

---

## 🐍 Backend Deployment (Render)

### Step 1: Prepare Backend

Verify these files exist in `/backend`:

```
backend/
├── main.py              ✅ FastAPI application
├── requirements.txt     ✅ Python dependencies
├── runtime.txt          ✅ Python version (3.11.9)
└── render.yaml          ✅ Render configuration (optional)
```

### Step 2: Create Render Account

1. Visit [https://render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### Step 3: Create Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Select **"Build and deploy from a Git repository"**
   - Click **"Connect"** next to your repository
   - If not listed, click **"Configure account"** to grant access

3. **Configure Service:**

   | Setting | Value | Notes |
   |---------|-------|-------|
   | **Name** | `linkr-backend` | Or any name you prefer |
   | **Region** | `Oregon` | Choose closest to your users |
   | **Branch** | `main` | Or your default branch |
   | **Root Directory** | `backend` | ⚠️ Important! |
   | **Runtime** | `Python 3` | Auto-detected |
   | **Build Command** | `pip install -r requirements.txt` | Auto-filled |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Copy exactly |
   | **Instance Type** | `Free` | Free tier available |

4. **Environment Variables (Optional):**
   
   Click **"Advanced"** if you need to add:
   ```
   PYTHON_VERSION=3.11.9
   ```

5. Click **"Create Web Service"**

### Step 4: Wait for Deployment

- Build process takes **2-5 minutes**
- Watch live logs in the dashboard
- Status changes: `Building` → `Deploying` → `Live` ✅

### Step 5: Get Backend URL

Once deployed, Render provides a URL:
```
https://linkr-backend-XXXX.onrender.com
```

**⚠️ IMPORTANT:** Copy this URL! You'll need it for frontend configuration.

### Step 6: Test Backend

**Method 1: Browser**
```
https://linkr-backend-XXXX.onrender.com/docs
```
Should display interactive API documentation (Swagger UI).

**Method 2: curl**
```bash
curl https://linkr-backend-XXXX.onrender.com/
```

Expected response:
```json
{
  "message": "linkr QR Code Generator API",
  "version": "1.0.0"
}
```

**Method 3: Test QR Generation**
```bash
curl -X POST "https://linkr-backend-XXXX.onrender.com/generate-qr" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "foreground_color": "#000000",
    "background_color": "#ffffff",
    "format": "png"
  }'
```

Should return JSON with `qr_code` (base64) and `formatted_url`.

✅ **Backend deployment complete!**

---

## ⚛️ Frontend Deployment (Vercel)

### Step 1: Update API Configuration

Before deploying, you need to configure the frontend to use your backend URL.

**Option A: Environment Variables (Recommended)**

1. Create/update `.env.example` in project root:
   ```env
   VITE_API_URL=your-backend-url-here
   ```

2. Update your code to use environment variables:
   ```typescript
   // src/components/QRGenerator.tsx or wherever API URL is defined
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   ```

**Option B: Direct Configuration**

Update the API URL directly in your code:
```typescript
// src/components/QRGenerator.tsx
const API_URL = 'https://linkr-backend-XXXX.onrender.com';
```

**⚠️ Commit and push changes:**
```bash
git add .
git commit -m "Configure backend URL for production"
git push origin main
```

### Step 2: Create Vercel Account

1. Visit [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Find your repository in the list
   - Click **"Import"**
   - If not listed, click **"Adjust GitHub App Permissions"**

3. **Configure Project:**

   | Setting | Value | Notes |
   |---------|-------|-------|
   | **Project Name** | `linkr` | Or any name |
   | **Framework Preset** | `Vite` | Auto-detected |
   | **Root Directory** | `./` | Leave as default |
   | **Build Command** | `npm run build` | Auto-filled |
   | **Output Directory** | `dist` | Auto-filled |

4. **Environment Variables:**

   Click **"Environment Variables"** and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://linkr-backend-XXXX.onrender.com` |

   Replace with your actual Render backend URL.

5. Click **"Deploy"**

### Step 4: Wait for Deployment

- Build takes **1-3 minutes**
- Watch build logs in real-time
- Status: `Building` → `Ready` ✅

### Step 5: Get Frontend URL

Vercel provides a URL:
```
https://linkr-XXXX.vercel.app
```

Or your custom domain if configured.

### Step 6: Test Frontend

1. Visit your Vercel URL
2. Enter a test URL (e.g., `https://github.com`)
3. Customize colors if desired
4. Click **"Generate QR Code"**
5. Verify QR code appears
6. Test download functionality

✅ **Frontend deployment complete!**

---

## 🔐 Environment Variables

### Backend (Render)

Optional environment variables:

```env
PYTHON_VERSION=3.11.9
ENVIRONMENT=production
LOG_LEVEL=info
```

### Frontend (Vercel)

Required environment variables:

```env
VITE_API_URL=https://linkr-backend-XXXX.onrender.com
```

### Local Development

Create `.env` in project root:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing Deployment

### Complete End-to-End Test

1. **Visit Frontend:**
   ```
   https://linkr-XXXX.vercel.app
   ```

2. **Generate QR Code:**
   - Enter URL: `https://www.example.com`
   - Choose colors (optional)
   - Click "Generate QR Code"
   - Verify QR code appears

3. **Test Download:**
   - Try each format: PNG, JPG, PDF, SVG
   - Verify file downloads correctly
   - Scan QR code with phone to verify it works

4. **Test Customization:**
   - Change foreground color
   - Change background color
   - Verify colors apply correctly

5. **Test Different URLs:**
   - Simple URL: `example.com`
   - With protocol: `https://github.com`
   - With path: `https://github.com/username/repo`
   - With parameters: `https://example.com?id=123`

### API Health Check

```bash
# Check backend health
curl https://linkr-backend-XXXX.onrender.com/

# Check API documentation
curl https://linkr-backend-XXXX.onrender.com/docs

# Test CORS
curl -H "Origin: https://linkr-XXXX.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://linkr-backend-XXXX.onrender.com/generate-qr
```

---

## 🔧 Troubleshooting

### Backend Issues

#### ❌ Build Failed

**Error:** `Could not find a version that satisfies the requirement`

**Solution:**
1. Check `requirements.txt` syntax
2. Verify Python version in `runtime.txt`
3. Test locally:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

#### ❌ Service Won't Start

**Error:** `Application startup failed`

**Solution:**
1. Check logs in Render dashboard
2. Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Ensure `main.py` has no syntax errors
4. Check that `main:app` references exist

#### ❌ 502 Bad Gateway

**Causes:**
- Service is starting up (cold start on free tier)
- Application crashed
- Port configuration issue

**Solution:**
1. Wait 30-60 seconds (cold start)
2. Check logs for errors
3. Verify `--port $PORT` in start command
4. Restart service

#### ❌ CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Verify CORS middleware in `main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Or specific domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
2. For production, specify frontend URL:
   ```python
   allow_origins=["https://linkr-XXXX.vercel.app"]
   ```

### Frontend Issues

#### ❌ Build Failed

**Error:** `npm install failed`

**Solution:**
1. Check `package.json` syntax
2. Verify Node.js version compatibility
3. Clear cache and retry:
   - Vercel Dashboard → Project Settings → Clear Cache

#### ❌ Environment Variables Not Working

**Error:** `VITE_API_URL is undefined`

**Solution:**
1. Verify variable name starts with `VITE_`
2. Check it's added in Vercel dashboard
3. Redeploy after adding variables
4. Access with: `import.meta.env.VITE_API_URL`

#### ❌ API Connection Failed

**Error:** Network request failed / Cannot reach backend

**Solution:**
1. Verify backend URL is correct
2. Check backend is live (visit `/docs`)
3. Verify CORS is configured
4. Check browser console for specific errors
5. Test API directly with curl

#### ❌ QR Code Not Generating

**Checklist:**
- [ ] Backend is running (`/docs` loads)
- [ ] Frontend has correct `VITE_API_URL`
- [ ] No CORS errors in browser console
- [ ] Network tab shows API request
- [ ] API returns 200 status

### Common Issues

#### 🐌 Slow First Request (Cold Start)

**Problem:** First request after inactivity takes 50+ seconds

**Explanation:** Render free tier spins down after 15 minutes of inactivity.

**Solutions:**
1. **Accept it** - Normal on free tier
2. **Keep alive service:**
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Ping your API every 14 minutes
   - Configure: HTTP(s) monitor → `https://linkr-backend-XXXX.onrender.com/`
3. **Upgrade** - Paid plan ($7/month) keeps service always on

#### 🔄 Changes Not Reflecting

**Solution:**
1. Verify code is committed and pushed
2. Check if auto-deploy is enabled
3. Manually redeploy:
   - **Render:** Dashboard → Manual Deploy
   - **Vercel:** Dashboard → Redeploy

#### 📱 Mobile Issues

**Solution:**
1. Test responsive design
2. Verify QR codes scan correctly
3. Check file download on mobile browsers
4. Test different mobile browsers (Safari, Chrome)

---

## ⚙️ Advanced Configuration

### Custom Domains

#### Render (Backend)

1. Go to service settings
2. Click **"Custom Domain"**
3. Add domain: `api.yourdomain.com`
4. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: linkr-backend-XXXX.onrender.com
   ```
5. Wait for DNS propagation (up to 48 hours)
6. Render provides free SSL certificate

#### Vercel (Frontend)

1. Go to project settings
2. Click **"Domains"**
3. Add domain: `yourdomain.com`
4. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for verification
6. Auto SSL certificate

### Performance Optimization

#### Backend

1. **Enable compression:**
   ```python
   from fastapi.middleware.gzip import GZipMiddleware
   app.add_middleware(GZipMiddleware, minimum_size=1000)
   ```

2. **Add caching headers:**
   ```python
   @app.get("/")
   async def root():
       return Response(
           content=json.dumps({"message": "API"}),
           headers={"Cache-Control": "public, max-age=3600"}
       )
   ```

3. **Optimize QR generation:**
   - Already optimized in code
   - Consider adding Redis cache for frequent URLs

#### Frontend

1. **Build optimization:**
   ```bash
   npm run build -- --mode production
   ```

2. **Enable compression** (automatic on Vercel)

3. **Lazy loading:**
   ```typescript
   const QRGenerator = lazy(() => import('./components/QRGenerator'));
   ```

### Monitoring & Alerts

#### Render

1. **View Logs:**
   - Dashboard → Service → Logs tab
   - Filter by level: Info, Warning, Error

2. **Metrics** (Paid plans):
   - CPU usage
   - Memory usage
   - Response times

#### Vercel

1. **Analytics:**
   - Dashboard → Analytics tab
   - Page views, performance metrics

2. **Real-time logs:**
   - Dashboard → Deployments → View Function Logs

### Automatic Deployments

Both platforms support automatic deployments:

**When you push to main:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

**Both services automatically:**
1. Detect the push
2. Start build process
3. Run tests (if configured)
4. Deploy new version
5. Send notification

**Disable auto-deploy:**
- **Render:** Settings → Auto-Deploy → Off
- **Vercel:** Settings → Git → Disable

---

## 📊 Monitoring & Maintenance

### Health Checks

Set up automated monitoring:

**UptimeRobot Configuration:**
```
Monitor Type: HTTP(s)
URL: https://linkr-backend-XXXX.onrender.com/
Interval: 14 minutes
Alert Contacts: your-email@example.com
```

### Logs

**Render Logs:**
```bash
# View in dashboard or via CLI
render logs -s linkr-backend
```

**Vercel Logs:**
```bash
# Via Vercel CLI
vercel logs linkr
```

### Updates

**Update Backend Dependencies:**
```bash
cd backend
pip list --outdated
pip install --upgrade package-name
pip freeze > requirements.txt
git commit -am "Update dependencies"
git push
```

**Update Frontend Dependencies:**
```bash
npm outdated
npm update
git commit -am "Update dependencies"
git push
```

### Backup

**Recommended:**
1. Keep code in GitHub (automatic backup)
2. Tag releases:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```
3. Regular testing of deployment process

---

## 📚 Additional Resources

### Documentation

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Vite Documentation](https://vitejs.dev)

### Community

- [Render Community](https://community.render.com)
- [Vercel Discussions](https://github.com/vercel/vercel/discussions)
- [FastAPI Discussions](https://github.com/tiangolo/fastapi/discussions)

### Support

- **Render:** support@render.com
- **Vercel:** support@vercel.com
- **linkr Issues:** [GitHub Issues](https://github.com/writetosagnik/linkr/issues)

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Code committed to Git
- [ ] Code pushed to GitHub
- [ ] All tests passing locally
- [ ] Dependencies up to date
- [ ] Environment variables documented

### Backend Deployment

- [ ] Render account created
- [ ] Web service created
- [ ] Build completed successfully
- [ ] Service is live
- [ ] Health check passing (`/docs` loads)
- [ ] API endpoints tested
- [ ] Backend URL copied

### Frontend Deployment

- [ ] Backend URL configured in frontend
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Site is live
- [ ] QR generation works
- [ ] Download functionality works

### Post-Deployment

- [ ] End-to-end testing complete
- [ ] Mobile testing complete
- [ ] Performance acceptable
- [ ] Monitoring set up (optional)
- [ ] Custom domain configured (optional)
- [ ] Documentation updated
- [ ] Team notified

---

## 🎉 Success!

Your linkr application is now live!

**URLs:**
- 🌐 Frontend: `https://linkr-XXXX.vercel.app`
- 🔌 Backend: `https://linkr-backend-XXXX.onrender.com`
- 📚 API Docs: `https://linkr-backend-XXXX.onrender.com/docs`

**Next Steps:**
- Share your application with users
- Set up custom domain (optional)
- Monitor usage and performance
- Gather feedback for improvements
- Consider upgrading to paid plans for better performance

**Questions?** Open an issue on [GitHub](https://github.com/writetosagnik/linkr/issues)

---

*Last Updated: October 2025*
*Deployment Guide Version: 2.0*
