# Google OAuth Setup Guide

## Steps to Enable Google Login

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen first (if not done):
   - User Type: External
   - App name: FlowCast
   - User support email: your email
   - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: FlowCast Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `http://localhost:5000` (for backend)
     - Your production URLs
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - Your production callback URL
7. Copy the **Client ID** and **Client Secret**

### 2. Update Backend .env File

Add these to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install axios
```

### 4. Test Google Login

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Click "Google" button on login/signup page
4. You should be redirected to Google login
5. After authentication, you'll be redirected back to dashboard

## Important Notes

- **Development**: Use `http://localhost:3000` and `http://localhost:5000`
- **Production**: Update URLs in Google Console and .env file
- **Security**: Never commit `.env` file with secrets
- **HTTPS**: Production requires HTTPS for OAuth

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Check that redirect URI in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`

**Error: "invalid_client"**
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file

**Error: "access_denied"**
- User cancelled the OAuth flow
