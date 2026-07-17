# Google OAuth2 Setup Guide

## 🔐 Overview

This project now includes Google OAuth2 authentication for saving user progress locally without backend complexity. All data is stored securely in the browser's localStorage.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → Create OAuth 2.0 Client ID (Web application)
5. Add authorized origins:
   - `http://localhost:8000` (for local development)
   - `https://yourdomain.com` (your production domain)
6. Add authorized redirect URIs (same as above)
7. Copy your **Client ID** (looks like: `YOUR_ID.apps.googleusercontent.com`)

### Step 2: Configure Your Project

Create a `.env.local` file in the root of your project:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

### Step 3: Update auth.js

In `js/auth.js`, replace this line:

```javascript
const GOOGLE_CLIENT_ID = 'REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID';
```

With your actual Client ID:

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

### Step 4: Test Locally

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run linter
npm run lint
```

## 📊 How It Works

### Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Google login popup
    ↓
Google returns JWT token
    ↓
App validates token locally
    ↓
User info stored in localStorage (only ID, name, picture)
    ↓
Progress synced per user
```

### Data Storage

Each user's progress is stored with a unique key based on their Google ID:

```javascript
localStorage[`nv_<google_user_id>_progress`] = { completedLessons: [...] }
```

**What's stored:**
- ✅ Completed lessons
- ✅ Quiz attempts
- ✅ Bookmarks
- ✅ Progress percentage

**What's NOT stored:**
- ❌ Email address
- ❌ Password (never)
- ❌ Personal information
- ❌ Google authentication token (only in memory)

## 🔒 Security Features

- ✅ **HTTPS Required** - OAuth only works on HTTPS (except localhost)
- ✅ **No Backend Needed** - Zero server-side complexity
- ✅ **JWT Validation** - Token validated locally
- ✅ **CORS Protected** - Google handles origin validation
- ✅ **Anonymous IDs** - Uses Google's unique user ID, not email
- ✅ **LocalStorage Isolation** - Each browser/domain isolated

## 🎯 User Experience

### Login
- User sees "Sign in with Google" button in header
- Clicks button → Google popup → Redirects back
- Avatar and name appear in header
- Progress automatically loads

### Logout
- Click avatar → Click logout button (↗️)
- Progress saved locally
- Logged out

### Multi-Device
- Each device has separate localStorage
- User can sync by logging in on each device
- Progress is per-device (not cloud synced)

## 📱 Usage in JavaScript

### Check if logged in:
```javascript
if (window.NVAuth.isAuthenticated) {
  console.log(window.NVAuth.user);
}
```

### Get user info:
```javascript
const user = window.NVAuth.getUser();
console.log(user.name, user.picture);
```

### Save progress:
```javascript
const progress = { /* lesson data */ };
window.NVAuth.setProgress(progress);
```

### Get progress:
```javascript
const userProgress = window.NVAuth.getProgress();
```

### Listen to auth events:
```javascript
document.addEventListener('nvauth:login', (e) => {
  console.log('User logged in:', e.detail);
});

document.addEventListener('nvauth:logout', () => {
  console.log('User logged out');
});
```

## 🐛 Troubleshooting

### "Google Sign-In is not working"

1. Check Client ID is correct in `auth.js`
2. Check domain is whitelisted in Google Cloud Console
3. Open browser console (F12) for error messages
4. Ensure you're on HTTPS in production

### "Progress not saving"

1. Check localStorage quota (usually 5-10MB)
2. Check if user is authenticated: `window.NVAuth.isAuthenticated`
3. Check browser console for errors
4. Clear localStorage and try again

### "Can't see Google button"

1. Make sure `js/auth.js` is loaded
2. Make sure `https://accounts.google.com/gsi/client` script is loaded
3. Check CSS is not hiding it: `#auth-signin { display: flex; }`

## 📚 Files Modified/Created

- ✨ `.env.example` - Configuration template
- ✨ `js/auth.js` - Authentication module (new)
- 📝 `index.html` - Added Google libraries and auth UI
- 📝 `js/app.js` - Integrated progress sync
- 📝 `css/styles.css` - Auth UI styles

## 🚀 Deployment

1. Set `VITE_GOOGLE_CLIENT_ID` in your hosting environment
2. Add your production domain to Google Cloud Console
3. Deploy to production
4. Test login flow

## ⚠️ Important Notes

- **No server backend needed** - This is entirely client-side
- **LocalStorage only** - Data is not synced to cloud
- **Per-device** - Each device maintains separate progress
- **Optional** - Users can still use without logging in
- **Privacy** - No personal data collected beyond name/picture

## 🔗 References

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [JWT.io](https://jwt.io/)

---

**Questions?** Check the browser console for detailed error messages!
