# Alternative Backend Deployment Solution

## Issue: Vercel Python Backend Authentication

The current issue is that Vercel's Python deployments have authentication requirements that are causing CORS and fetch errors.

## Solution: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy Backend to Railway
1. Connect your GitHub repository
2. Select the `backend` folder
3. Railway will auto-detect Python and deploy

### Step 3: Update Environment Variable
Once Railway gives you a URL like: `https://linkr-backend-production.up.railway.app`

Update Vercel frontend environment variable:
```
VITE_API_BASE_URL=https://linkr-backend-production.up.railway.app
```

## Alternative: Fix Vercel Backend

If you want to stick with Vercel, try these fixes:

### Fix 1: Update vercel.json in backend
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ],
  "env": {
    "PYTHON_VERSION": "3.9"
  }
}
```

### Fix 2: Add Access Control Headers
Add to main.py:
```python
@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
```
