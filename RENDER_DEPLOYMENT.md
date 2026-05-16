# SevaTrack Deployment Guide - Render

## Quick Start

### 1. **Backend Deployment (Node.js Server)**

#### Create a new Render Web Service:
- Go to https://render.com/dashboard
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `main` branch

#### Configuration:
- **Name:** `sevatrack-backend`
- **Runtime:** Node
- **Build Command:** 
  ```
  npm install
  ```
- **Start Command:**
  ```
  node server.js
  ```

#### Environment Variables (Add these):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sevatrack?retryWrites=true&w=majority
NODE_ENV=production
PORT=3000
```

#### Get your backend URL:
Once deployed, you'll get a URL like: `https://sevatrack-backend.onrender.com`

---

### 2. **Frontend Deployment (Static Site)**

#### Create a new Render Static Site:
- Go to https://render.com/dashboard
- Click "New +" → "Static Site"
- Connect your GitHub repository
- Select the `main` branch

#### Configuration:
- **Name:** `sevatrack-frontend`
- **Build Command:**
  ```
  cd fe && npm install && npm run build
  ```
- **Publish Directory:**
  ```
  fe/dist
  ```

#### Environment Variables (Add these):
```
VITE_API_BASE_URL=https://sevatrack-backend.onrender.com
```

Replace `sevatrack-backend.onrender.com` with your actual backend URL from step 1.

---

### 3. **Code Changes (Already Done ✅)**

All API calls now use environment variables:
- `AuthContext.jsx` - Updated ✅
- `WorkerReportForm.jsx` - Updated ✅
- Environment files created ✅

---

## Manual Testing Before Deploy

Run locally with production URLs:

```bash
# Terminal 1 - Backend
cd be
npm run dev

# Terminal 2 - Frontend (with production backend)
cd fe
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend environment variables set in Render
- [ ] Frontend environment variable with backend URL set in Render
- [ ] `.env.example` file committed to repo
- [ ] All code changes committed and pushed
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Test login functionality
- [ ] Test report submission
- [ ] Test edit functionality

---

## Troubleshooting

**Frontend shows "Backend server not running":**
- Check if backend URL in `VITE_API_BASE_URL` is correct
- Ensure MongoDB connection is working
- Check Render logs for backend errors

**CORS errors:**
- Backend already has CORS enabled
- If issues persist, check that frontend URL is accessible

**Slow initial load:**
- Render free tier has limited resources
- First request may take 30+ seconds if service is sleeping
- Upgrade to paid tier for faster performance

---

## Cost Estimation (Free Tier)

- **Backend:** $0/month (free tier with limits)
- **Frontend:** $0/month (static sites are always free)
- **MongoDB:** $0/month (M0 free tier)

**Total: $0 initially**

*Note: Free tier has limitations. Monitor usage and upgrade if needed.*
