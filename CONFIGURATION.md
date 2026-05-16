# SevaTrack - Configuration Summary

## Quick Reference

### Frontend Configuration
**Location:** `fe/.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>
```

**Running the Frontend:**
```bash
cd fe
npm install
npm run dev
```
- Runs on: **http://localhost:5173** (Vite default port)

---

### Backend Configuration
**Location:** `be/.env`
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=basicsecretkey
JWT_EXPIRE=24h
ADMIN_EMAIL_DOMAIN=sevatrack.org

# MongoDB Configuration
MONGODB_URI=mongodb+srv://sahithi:<db_password>@cluster0.3m5p8bi.mongodb.net/?appName=Cluster0

# Google OAuth Configuration
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

**Running the Backend:**
```bash
cd be
npm install
npm run dev
```
- Runs on: **http://localhost:3000**
- MongoDB connection required

---

## Google Console Setup - What to Add

### In Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client

### Authorized JavaScript Origins
Add ALL of these:
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

### Authorized Redirect URIs
Add ALL of these:
```
http://localhost:5173
http://localhost:5173/auth/google/callback
http://localhost:3000/api/auth/admin/google/callback
```

---

## Login Flows

### Field Worker Login
- **Email:** Any email (any domain)
- **Password:** Any password (demo mode)
- **Route:** POST `/api/auth/worker/login`
- **Response:** JWT token + Worker profile

### NGO Admin Login
- **Email:** Must be @sevatrack.org domain
- **Login Method:** Google OAuth only
- **Route:** POST `/api/auth/admin/google/callback`
- **Response:** JWT token + Admin profile

---

## API Endpoints

### Authentication
- `POST /api/auth/worker/login` - Field worker login
- `POST /api/auth/admin/google/callback` - Admin Google OAuth
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin Only (requires token + admin role)
- `GET /api/auth/admin/workers` - List all workers
- `GET /api/auth/admin/workers/:workerId` - Get worker details
- `PATCH /api/auth/admin/workers/:workerId/status` - Update worker status

---

## Project Structure

```
sevaTrack/
├── be/ (Backend - Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js (MongoDB connection)
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js (JWT verification)
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── UserModel.js (MongoDB schema)
│   │   │   ├── WorkerProfileModel.js
│   │   │   └── SessionModel.js
│   │   └── routes/
│   │       └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── fe/ (Frontend - React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   └── LoginPage.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DataContext.jsx
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
│
├── GOOGLE_OAUTH_SETUP.md
├── API_DOCUMENTATION.md
├── README.md
└── LICENSE
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  name: String,
  role: 'admin' | 'worker',
  workerId: String (for workers only),
  googleId: String (for admins via Google OAuth),
  profilePicture: String,
  isVerified: Boolean,
  status: 'active' | 'inactive' | 'suspended',
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### WorkerProfile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  email: String,
  name: String,
  phone: String,
  location: String,
  submissionCount: Number,
  status: 'active' | 'inactive' | 'suspended',
  createdAt: Date,
  updatedAt: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  token: String (unique),
  email: String,
  role: 'admin' | 'worker',
  expiresAt: Date, // TTL index - auto-deletes
  createdAt: Date,
  updatedAt: Date
}
```

---

## Next Steps

1. **Complete Google OAuth Setup** (see GOOGLE_OAUTH_SETUP.md)
2. **Update .env files** with your Google credentials
3. **Start Backend:** `cd be && npm run dev`
4. **Start Frontend:** `cd fe && npm run dev`
5. **Test Login Flows:**
   - Worker: Use any email
   - Admin: Use your @sevatrack.org account with Google

---

## Important Notes

✅ **Whitelisting removed** - Any email can now login as field worker
✅ **Google OAuth only** - Admin login now requires Google authentication
✅ **MongoDB integrated** - All data persists in your MongoDB cluster
✅ **JWT Authentication** - Secure token-based API access
✅ **Role-based access** - Admin and worker routes protected
✅ **Development ready** - Hot reload with nodemon (backend) and Vite (frontend)
