# Vercel Deployment - Backend Setup

## Important: Backend Deployment Required

Since this project uses a Python FastAPI backend, you need to deploy it separately. Here are your options:

### Option 1: Deploy Backend to Vercel (Recommended)

1. **Create a separate repository for the backend:**
   ```bash
   # In a new directory
   git clone <your-repo> linkr-backend
   cd linkr-backend
   # Keep only the backend folder and create vercel.json
   ```

2. **Create `backend/vercel.json`:**
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
     ]
   }
   ```

3. **Update backend CORS for production:**
   - Add your Vercel frontend URL to allowed origins
   - Remove localhost URLs for production

### Option 2: Use Railway/Render for Backend

Alternative platforms that support Python:
- **Railway**: Easy Python deployment
- **Render**: Free tier available
- **Heroku**: Classic choice

### Environment Variables

Set these in your Vercel frontend deployment:
- `VITE_API_BASE_URL`: Your deployed backend URL

## Current Status

✅ Frontend ready for Vercel deployment  
⚠️ Backend needs separate deployment  
✅ Environment variables configured  
✅ CORS configured for development  

## Next Steps

1. Deploy backend first
2. Get backend URL
3. Update frontend environment variable
4. Deploy frontend to Vercel
