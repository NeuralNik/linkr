# 🚀 Quick Start: Deploy Backend to Render

## 5-Minute Deployment Guide

### Prerequisites
- ✅ GitHub account
- ✅ Code pushed to GitHub
- ✅ Render account (free at render.com)

---

## Step-by-Step

### 1️⃣ Sign Up for Render
```
https://render.com → Sign up with GitHub
```

### 2️⃣ Create New Web Service
```
Dashboard → New + → Web Service → Connect Repository
```

### 3️⃣ Configure Service

Copy these exact settings:

| Field | Value |
|-------|-------|
| **Name** | `linkr-backend` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### 4️⃣ Click "Create Web Service"

Wait 2-5 minutes for deployment ⏱️

### 5️⃣ Get Your URL

Copy the URL: `https://linkr-backend-xxxx.onrender.com`

---

## Test Your Deployment

### Quick Test
Visit: `https://your-url.onrender.com/docs`

Should see: **Interactive API Documentation** ✅

### Full Test
```bash
curl https://your-url.onrender.com/
```

Response: `{"message": "linkr API is running"}` ✅

---

## Update Frontend

**Option 1:** Direct URL
```typescript
// src/components/QRGenerator.tsx
const API_URL = 'https://linkr-backend-xxxx.onrender.com';
```

**Option 2:** Environment Variable
```bash
# .env
VITE_API_URL=https://linkr-backend-xxxx.onrender.com
```

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Important Notes

⚠️ **Free Tier:** Service sleeps after 15 min of inactivity
- First request after sleep: 50+ seconds
- Keep alive: Use UptimeRobot (free)

🔄 **Auto-Deploy:** Pushes to main branch auto-deploy

📊 **Logs:** Dashboard → Your Service → Logs tab

---

## Common Issues

### Build Fails
✅ Check `requirements.txt` exists in `/backend`
✅ Verify Python 3.11.9 in `runtime.txt`

### CORS Errors  
✅ Already configured in your `main.py`
✅ `allow_origins=["*"]` permits all origins

### 404 Errors
✅ Use full URL with `/docs` or `/generate-qr`
✅ Check Root Directory = `backend`

---

## Next Steps

1. ✅ Deploy to Render (you are here!)
2. Update frontend with new URL
3. Deploy frontend to Vercel/Netlify
4. Test complete application
5. Share with users! 🎉

---

## Support Links

- 📖 [Full Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- ✅ [Checklist](./RENDER_DEPLOYMENT_CHECKLIST.md)
- 🌐 [Render Docs](https://render.com/docs)

---

**That's it! Your backend is now live! 🚀**
