# Commands to update frontend after Railway deployment

# Step 1: Remove old environment variable
cd C:\Users\KIIT0001\Desktop\linkr
npx vercel env rm VITE_API_BASE_URL

# Step 2: Add new Railway URL
npx vercel env add
# When prompted:
# Name: VITE_API_BASE_URL  
# Value: https://your-railway-url.up.railway.app
# Environment: Production

# Step 3: Redeploy frontend
npx vercel --prod

# Your linkr app will now use Railway backend! 🚀
