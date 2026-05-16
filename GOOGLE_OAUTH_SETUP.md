# Google OAuth Setup Guide for SevaTrack

## Step-by-Step Google Console Configuration

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project (if you don't have one)
- Click on "Select a Project" → "NEW PROJECT"
- Project name: "SevaTrack"
- Click "CREATE"
- Wait for the project to be created

### 3. Enable Google+ API
- In the left sidebar, go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and select "ENABLE"

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- If prompted, configure the OAuth consent screen first:
  - Choose "External" as user type
  - Click "CREATE"
  - Fill in required fields (App name, User support email, etc.)
  - Click "SAVE AND CONTINUE" through all pages
  - Then come back to create credentials

### 5. Configure OAuth Client
- Application type: Select "Web application"
- Name: "SevaTrack Frontend"
- **Authorized JavaScript origins** (ADD THESE):
  ```
  http://localhost:3000
  http://localhost:5000
  http://127.0.0.1:3000
  http://127.0.0.1:5000
  ```

- **Authorized redirect URIs** (ADD THESE):
  ```
  http://localhost:3000/auth/google/callback
  http://localhost:3000
  http://localhost:5000/api/auth/admin/google/callback
  ```

### 6. Copy Your Credentials
- After creating, you'll see your Client ID and Client Secret
- Copy the **Client ID** (this is what you need)

---

## Update Configuration Files

### Backend (.env)
```env
GOOGLE_CLIENT_ID=<paste_your_client_id_here>
GOOGLE_CLIENT_SECRET=<paste_your_client_secret_here>
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=<paste_your_client_id_here>
VITE_API_URL=http://localhost:5000/api
```

---

## Summary of URLs to Add in Google Console

| Type | URL |
|------|-----|
| **Authorized JavaScript origins** | `http://localhost:5173` |
| **Authorized JavaScript origins** | `http://localhost:3000` |
| **Authorized JavaScript origins** | `http://127.0.0.1:5173` |
| **Authorized JavaScript origins** | `http://127.0.0.1:3000` |
| **Authorized redirect URIs** | `http://localhost:5173` |
| **Authorized redirect URIs** | `http://localhost:5173/auth/google/callback` |
| **Authorized redirect URIs** | `http://localhost:3000/api/auth/admin/google/callback` |

---

## Running the Application

### Terminal 1 - Start Backend
```bash
cd be
npm run dev
```
Backend runs on: `http://localhost:3000`

### Terminal 2 - Start Frontend
```bash
cd fe
npm run dev
```
Frontend runs on: `http://localhost:5173` (Vite default)

---

## Testing Google Login

1. Frontend will be available at `http://localhost:5173`
2. Click "NGO Admin" on login page
3. You'll see Google Sign-In button
4. Click it and sign in with your @sevatrack.org account
5. You should be redirected back to the dashboard

---

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches your frontend callback URL
- Common mistake: using `localhost` instead of `127.0.0.1` or vice versa

### "Client ID not recognized" error
- Verify you've added `http://localhost:3000` to Authorized JavaScript origins
- Not just redirect URIs, also the origin

### "Not allowed to access" error
- Check that your Gmail account uses `@sevatrack.org` domain
- Admin login only works with sevatrack.org emails

---

## Notes
- Field workers can login with ANY email address
- NGO admins MUST use @sevatrack.org email and Google login
- Keep your Client Secret secure - never commit it to git
- The `.env` files are already in `.gitignore`
