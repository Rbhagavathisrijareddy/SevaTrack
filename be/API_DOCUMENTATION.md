# SevaTrack Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend root directory with:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production_12345
JWT_EXPIRE=24h
ADMIN_EMAIL_DOMAIN=sevatrack.org

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 3. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000` and `http://localhost:5000` to authorized origins
6. Add `http://localhost:3000/auth/google/callback` to authorized redirect URIs
7. Copy your Client ID and Client Secret to the `.env` file

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Documentation

### Authentication Endpoints

#### 1. Field Worker Login
**Endpoint:** `POST /api/auth/worker/login`

**Description:** Login for field workers (accepts any email)

**Request Body:**
```json
{
  "email": "worker@example.com",
  "password": "any_password",
  "name": "Worker Name (optional)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Field worker login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-xxx",
      "email": "worker@example.com",
      "name": "Worker Name",
      "workerId": "WRK-1234567890",
      "role": "worker"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

---

#### 2. Admin Google OAuth Callback
**Endpoint:** `POST /api/auth/admin/google/callback`

**Description:** Authenticate admin users via Google OAuth (only @sevatrack.org domain)

**Request Body:**
```json
{
  "googleId": "google_user_id_from_google_auth",
  "email": "admin@sevatrack.org",
  "name": "Admin Name",
  "profilePicture": "https://...",
  "idToken": "google_id_token"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Admin login successful via Google",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "admin-xxx",
      "email": "admin@sevatrack.org",
      "name": "Admin Name",
      "role": "admin",
      "profilePicture": "https://..."
    }
  }
}
```

**Response (Error - 403 - Invalid Domain):**
```json
{
  "success": false,
  "message": "Only sevatrack.org email addresses can access the admin panel",
  "code": "INVALID_DOMAIN"
}
```

---

#### 3. Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate token

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 4. Get Current User
**Endpoint:** `GET /api/auth/me`

**Description:** Get authenticated user information

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-xxx",
      "email": "user@example.com",
      "role": "worker|admin",
      "name": "User Name"
    }
  }
}
```

---

#### 5. Get All Workers (Admin Only)
**Endpoint:** `GET /api/auth/admin/workers`

**Description:** Get list of all registered field workers

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "workers": [
      {
        "id": "user-xxx",
        "email": "worker1@example.com",
        "name": "Worker 1",
        "workerId": "WRK-1234567890",
        "createdAt": "2026-05-16T10:30:00.000Z",
        "lastLogin": "2026-05-16T10:35:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-05-16T10:30:00.000Z",
  "environment": "development"
}
```

---

## Frontend Integration

### Worker Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/worker/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'worker@example.com',
    password: 'any_password',
    name: 'Worker Name'
  })
});
const data = await response.json();
localStorage.setItem('token', data.data.token);
```

### Admin Google Login
```javascript
// After getting ID token from Google Sign-In library
const response = await fetch('http://localhost:5000/api/auth/admin/google/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    googleId: googleProfile.getId(),
    email: googleProfile.getEmail(),
    name: googleProfile.getGivenName(),
    profilePicture: googleProfile.getImageUrl(),
    idToken: googleProfile.getAuthResponse().id_token
  })
});
const data = await response.json();
localStorage.setItem('token', data.data.token);
```

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `INVALID_DOMAIN` | 403 | Email domain not authorized |
| `EMAIL_NOT_VERIFIED` | 401 | Email verification required |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INVALID_TOKEN` | 401 | Invalid or malformed JWT token |

---

## Notes

- Field workers can login with **any email address**
- NGO admins must use **@sevatrack.org email** and login via **Google OAuth**
- JWT tokens expire after 24 hours (configurable in `.env`)
- All protected endpoints require `Authorization: Bearer <token>` header
- Currently using in-memory storage (replace with MongoDB/PostgreSQL for production)
