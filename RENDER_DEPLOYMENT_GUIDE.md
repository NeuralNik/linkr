# Deploy linkr Backend to Render

This guide will walk you through deploying the linkr QR code generator backend to Render.

## Prerequisites

- A [Render](https://render.com) account (free tier available)
- Your code pushed to a GitHub repository
- Basic knowledge of Git and deployment

## Deployment Steps

### Step 1: Prepare Your Repository

Ensure your backend files are ready:

```
backend/
├── main.py
├── requirements.txt
├── runtime.txt
└── render.yaml
```

All files are already configured in your repository!

### Step 2: Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up using your GitHub account (recommended)
3. Authorize Render to access your repositories

### Step 3: Create a New Web Service

1. **From your Render Dashboard:**
   - Click the **"New +"** button in the top right
   - Select **"Web Service"**

2. **Connect Your Repository:**
   - Select **"Build and deploy from a Git repository"**
   - Click **"Connect account"** if you haven't connected GitHub yet
   - Find and select your `linkr` repository
   - Click **"Connect"**

3. **Configure the Web Service:**

   Fill in the following settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `linkr-backend` (or any name you prefer) |
   | **Region** | Choose closest to your users (e.g., Oregon, Frankfurt) |
   | **Branch** | `main` (or your default branch) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | `Free` |

4. **Environment Variables (Optional):**
   
   Click **"Advanced"** to add environment variables if needed:
   - `PYTHON_VERSION`: `3.13.3` (optional, Render auto-detects)

5. **Click "Create Web Service"**

### Step 4: Wait for Deployment

- Render will automatically:
  - Clone your repository
  - Install dependencies from `requirements.txt`
  - Start your FastAPI application
  - Provide you with a live URL

- The initial deployment takes 2-5 minutes
- You'll see live logs during the build process

### Step 5: Get Your Backend URL

Once deployed, Render provides a URL like:
```
https://linkr-backend-xxxx.onrender.com
```

**Important:** Copy this URL! You'll need it to configure your frontend.

### Step 6: Test Your Backend

Test your deployed API:

1. **Health Check:**
   ```
   https://linkr-backend-xxxx.onrender.com/docs
   ```
   This opens the interactive API documentation.

2. **Generate a QR Code:**
   ```bash
   curl -X POST "https://linkr-backend-xxxx.onrender.com/generate-qr" \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://github.com",
       "foreground_color": "#000000",
       "background_color": "#ffffff",
       "format": "png"
     }'
   ```

### Step 7: Update Frontend Configuration

Update your frontend to use the Render backend URL:

1. **Open your frontend code** (e.g., `src/components/QRGenerator.tsx`)

2. **Find the API endpoint:**
   ```typescript
   const API_URL = 'http://localhost:8000'; // Old local URL
   ```

3. **Replace with your Render URL:**
   ```typescript
   const API_URL = 'https://linkr-backend-xxxx.onrender.com';
   ```

4. **Or use environment variables:**
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'https://linkr-backend-xxxx.onrender.com';
   ```

### Step 8: Redeploy Frontend

If you're using Vercel/Netlify for your frontend:

1. Add the environment variable:
   ```
   VITE_API_URL=https://linkr-backend-xxxx.onrender.com
   ```

2. Redeploy your frontend

3. Test the complete application!

## Important Notes

### Free Tier Limitations

⚠️ **Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 50+ seconds (cold start)
- 750 hours/month of runtime (sufficient for most projects)

### Keep Your Service Active

To minimize cold starts:
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 14 minutes
- Upgrade to a paid plan ($7/month) for always-on services

### CORS Configuration

Your backend is already configured to accept requests from any origin:
```python
allow_origins=["*"]
```

For production, consider restricting to your frontend domain:
```python
allow_origins=["https://your-frontend-domain.vercel.app"]
```

## Automatic Deployments

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render detects the push and redeploys automatically! 🚀

## Monitoring & Logs

### View Logs:
1. Go to your Render dashboard
2. Click on your web service
3. Click the **"Logs"** tab
4. See real-time logs of your application

### View Metrics:
- Click the **"Metrics"** tab
- See CPU, memory usage, and response times
- Available on paid plans

## Troubleshooting

### Build Fails

**Error:** `Could not find a version that satisfies the requirement`

**Solution:** Check `requirements.txt` and ensure all packages are compatible:
```bash
pip install -r backend/requirements.txt
```

### Service Won't Start

**Error:** `Application startup failed`

**Solution:** Check logs for specific errors:
- Ensure `uvicorn` is installed
- Verify `main:app` matches your file structure
- Check for syntax errors in `main.py`

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:** Verify CORS middleware in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Cold Start Issues

**Problem:** First request takes too long

**Solution:**
- This is normal on the free tier
- Use UptimeRobot to keep the service warm
- Or upgrade to a paid plan

## Custom Domain (Optional)

To use a custom domain:

1. Go to your web service settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Configure DNS records as instructed
5. Render provides free SSL certificates!

## Next Steps

✅ Backend deployed on Render
✅ Frontend updated with new API URL
✅ Application fully functional

**Optional Enhancements:**
- Set up custom domain
- Add monitoring with UptimeRobot
- Implement rate limiting
- Add API authentication
- Set up staging environment

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

---

**Congratulations! 🎉**

Your linkr backend is now live on Render!

**Your API Endpoints:**
- Docs: `https://linkr-backend-xxxx.onrender.com/docs`
- Generate QR: `POST https://linkr-backend-xxxx.onrender.com/generate-qr`
- Download QR: `POST https://linkr-backend-xxxx.onrender.com/download-qr`
- Health Check: `GET https://linkr-backend-xxxx.onrender.com/`
