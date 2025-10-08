# 🚀 Render Deployment Checklist

Use this checklist to ensure a smooth deployment of your linkr backend to Render.

## Pre-Deployment Checklist

### ✅ Local Testing

- [ ] Navigate to backend directory: `cd backend`
- [ ] Create/activate virtual environment
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Run server locally: `uvicorn main:app --reload`
- [ ] Test API at `http://localhost:8000/docs`
- [ ] Test QR generation endpoint
- [ ] Verify CORS is working

### ✅ Code Repository

- [ ] All changes committed to Git
- [ ] Code pushed to GitHub
- [ ] Repository is public (or Render has access)
- [ ] Backend files in `/backend` directory
- [ ] All required files present:
  - [ ] `main.py`
  - [ ] `requirements.txt`
  - [ ] `runtime.txt`
  - [ ] `render.yaml` (optional)

### ✅ Configuration Files

**requirements.txt** should contain:
```
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
qrcode[pil]>=7.4.0
python-multipart>=0.0.6
reportlab>=4.0.0
```

**runtime.txt** should contain:
```
python-3.11.9
```

## Deployment Steps

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render to access repositories

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `linkr` repository

### Step 3: Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| Name | `linkr-backend` |
| Region | `Oregon` (or closest) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | `Free` |

- [ ] All settings configured correctly
- [ ] Click "Create Web Service"

### Step 4: Monitor Deployment
- [ ] Watch build logs
- [ ] Wait for "Live" status (2-5 minutes)
- [ ] Copy deployment URL

### Step 5: Test Deployment
- [ ] Visit: `https://your-service.onrender.com/docs`
- [ ] Test root endpoint: `https://your-service.onrender.com/`
- [ ] Test QR generation via API docs
- [ ] Verify response format

## Post-Deployment

### ✅ Frontend Integration

- [ ] Copy Render backend URL
- [ ] Update frontend API configuration
- [ ] Update environment variables:
  ```
  VITE_API_URL=https://your-service.onrender.com
  ```
- [ ] Test frontend → backend connection
- [ ] Verify QR code generation works
- [ ] Test QR code download

### ✅ CORS Configuration

- [ ] Test cross-origin requests
- [ ] Verify CORS headers in response
- [ ] If issues, check `main.py` CORS settings

### ✅ Performance Optimization

- [ ] Note: Free tier spins down after 15 min
- [ ] Consider UptimeRobot for keep-alive
- [ ] Or upgrade to paid plan ($7/month)

### ✅ Documentation

- [ ] Update README with backend URL
- [ ] Document API endpoints
- [ ] Add deployment notes

## Verification Tests

Run these tests after deployment:

### 1. Health Check
```bash
curl https://your-service.onrender.com/
```
Expected: `{"message": "linkr API is running"}`

### 2. Generate QR Code
```bash
curl -X POST "https://your-service.onrender.com/generate-qr" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "foreground_color": "#000000",
    "background_color": "#ffffff",
    "format": "png"
  }'
```
Expected: JSON with `qr_code` (base64) and `formatted_url`

### 3. API Documentation
Visit: `https://your-service.onrender.com/docs`
Expected: Interactive API documentation

### 4. CORS Test
```javascript
fetch('https://your-service.onrender.com/')
  .then(r => r.json())
  .then(data => console.log(data))
```
Expected: No CORS errors

## Common Issues & Solutions

### ❌ Build Failed

**Problem:** Dependencies won't install

**Solution:**
1. Check `requirements.txt` syntax
2. Test locally: `pip install -r requirements.txt`
3. Ensure Python version compatibility

### ❌ Service Won't Start

**Problem:** Application startup failed

**Solution:**
1. Check logs in Render dashboard
2. Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Ensure `main.py` has no syntax errors

### ❌ CORS Errors

**Problem:** Frontend can't access backend

**Solution:**
1. Verify CORS middleware in `main.py`
2. Check `allow_origins=["*"]`
3. Ensure CORS headers in response

### ❌ 404 Errors

**Problem:** Endpoints not found

**Solution:**
1. Verify URL includes full path
2. Check endpoint definitions in `main.py`
3. Test with `/docs` endpoint first

### ❌ Cold Start Delays

**Problem:** First request takes 50+ seconds

**Solution:**
1. Normal on free tier
2. Use UptimeRobot to ping every 14 minutes
3. Or upgrade to paid plan

## Environment Variables (Optional)

Add these in Render dashboard if needed:

```
PYTHON_VERSION=3.11.9
ENVIRONMENT=production
LOG_LEVEL=info
```

## Automatic Deployments

Every push to your main branch triggers redeployment:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Render detects and redeploys automatically! 🚀

## Monitoring

### View Logs:
1. Render Dashboard → Your Service
2. Click "Logs" tab
3. See real-time application logs

### Check Status:
1. Dashboard shows "Live" or "Building"
2. Recent deployments list
3. Build and runtime logs

## Next Steps After Deployment

- [ ] Share backend URL with team
- [ ] Update frontend deployment
- [ ] Test complete application
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Document API for users

## Success Criteria

Your deployment is successful when:

✅ Service shows "Live" status
✅ `/docs` endpoint loads
✅ Can generate QR codes via API
✅ Frontend can connect to backend
✅ No CORS errors
✅ QR codes download correctly

---

## 🎉 Deployment Complete!

Your linkr backend is now live on Render!

**Important URLs:**
- API Docs: `https://your-service.onrender.com/docs`
- Health Check: `https://your-service.onrender.com/`
- Generate QR: `POST https://your-service.onrender.com/generate-qr`

**Support:**
- [Render Docs](https://render.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Render Community](https://community.render.com)
