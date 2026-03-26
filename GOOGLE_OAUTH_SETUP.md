# 🔐 Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for the Mindfulness Tracker application.

**⏱️ Estimated Time**: 10-15 minutes  
**💰 Cost**: 100% FREE - No credit card required

---

## 📋 Prerequisites

- A Google account (any Gmail account works)
- Your application running locally:
  - Backend: `http://localhost:5000`
  - Frontend: `http://localhost:5173`

---

## 🚀 Step-by-Step Instructions

### Step 1: Access Google Cloud Console

1. Open your browser and go to: **[Google Cloud Console](https://console.cloud.google.com/)**
2. Sign in with your Google account
3. If this is your first time, you may see a welcome screen - click **"Select a project"** at the top

---

### Step 2: Create a New Project

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"NEW PROJECT"** button in the top right
3. Fill in the project details:
   - **Project name**: `Mindfulness Tracker` (or any name you prefer)
   - **Organization**: Leave as "No organization" (default)
4. Click **"CREATE"**
5. Wait a few seconds for the project to be created
6. **Select your new project** from the dropdown

---

### Step 3: Enable Required APIs

1. In the left sidebar, click **"APIs & Services"** > **"Library"**
   - Or use the search bar at the top and search for "API Library"
2. In the API Library search box, type: **"Google+ API"**
3. Click on **"Google+ API"** from the results
4. Click the blue **"ENABLE"** button
5. Wait for it to enable (you'll see a green checkmark)

---

### Step 4: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"** (left sidebar)
2. Select **"External"** user type
3. Click **"CREATE"**
4. Fill in the required App Information:
   - **App name**: `Mindfulness Tracker`
   - **User support email**: Select your email from the dropdown
   - **Developer contact information**: Enter your email address
5. Leave all other fields as default
6. Click **"SAVE AND CONTINUE"**
7. On the "Scopes" page, just click **"SAVE AND CONTINUE"** (default scopes are fine)
8. On the "Test users" page, click **"SAVE AND CONTINUE"** (we'll add users later if needed)
9. Review the summary and click **"BACK TO DASHBOARD"**

---

### Step 5: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** > **"Credentials"** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"** from the dropdown
4. If prompted to configure consent screen, you've already done that - continue
5. Fill in the following:
   - **Application type**: Select **"Web application"**
   - **Name**: `Mindfulness Tracker Web Client` (or any name)
   
6. **Add Authorized JavaScript origins:**
   - Click **"+ ADD URI"** under "Authorized JavaScript origins"
   - Enter: `http://localhost:5173`
   - Click **"+ ADD URI"** again
   - Enter: `http://localhost:5000`

7. **Add Authorized redirect URIs:**
   - Click **"+ ADD URI"** under "Authorized redirect URIs"
   - Enter: `http://localhost:5173`

8. Click **"CREATE"**

---

### Step 6: Copy Your Client ID

1. A popup will appear showing your credentials:
   - **Your Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Your Client Secret** (you don't need this for our app)

2. **IMPORTANT**: Click the **copy icon** next to "Your Client ID" to copy it
   - Or manually select and copy the entire Client ID

3. **Save it temporarily** in a text file or notepad

4. Click **"OK"** to close the popup

> 💡 **Tip**: You can always access your Client ID later by going to "APIs & Services" > "Credentials" and clicking on your OAuth client name.

---

## ⚙️ Step 7: Configure Your Application

Now that you have your Client ID, you need to configure both the frontend and backend:

### Backend Configuration

1. Open the backend `.env` file:
   ```
   c:\Users\User\Desktop\mindfulness tracker\backend\.env
   ```

2. Find the line:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. Replace `your_google_client_id_here` with your actual Client ID:
   ```env
   GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
   ```

4. **Save the file**

---

### Frontend Configuration

1. Create a new file in the frontend folder:
   ```
   c:\Users\User\Desktop\mindfulness tracker\frontend\.env
   ```

2. Add the following content (replace with your Client ID):
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
   ```

3. **Save the file**

4. Open the file:
   ```
   c:\Users\User\Desktop\mindfulness tracker\frontend\src\main.jsx
   ```

5. Find the line (around line 8):
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";
   ```

6. Replace it with:
   ```javascript
   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
   ```

7. **Save the file**

---

## 🔄 Step 8: Restart Your Servers

You need to restart both servers for the changes to take effect:

### Backend

1. In your backend terminal, press `Ctrl + C` to stop the server
2. Restart with:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a new terminal and navigate to frontend:
   ```bash
   cd "c:\Users\User\Desktop\mindfulness tracker\frontend"
   ```

2. Start the frontend server:
   ```bash
   npm run dev
   ```

---

## ✅ Step 9: Test Google Sign-In

1. Open your browser and go to: `http://localhost:5173/login`

2. You should see the **"Sign in with Google"** button

3. Click the button

4. A Google popup should appear asking you to:
   - Choose your Google account
   - Grant permissions to the app

5. After selecting your account and granting permissions:
   - You should be redirected to the Dashboard
   - You should be logged in successfully

6. Check your MongoDB database:
   - You should see a new user with your Google email
   - The user should have a `googleId` field

---

## 🐛 Troubleshooting

### Issue: Google button doesn't appear

**Solution**: 
- Check browser console for errors (F12)
- Verify the Client ID in `frontend/.env` is correct
- Make sure you restarted the frontend server

---

### Issue: "Error 400: redirect_uri_mismatch"

**Solution**:
- Go back to Google Cloud Console > Credentials
- Edit your OAuth Client
- Verify `http://localhost:5173` is in "Authorized JavaScript origins"
- Verify `http://localhost:5173` is in "Authorized redirect URIs"
- Make sure there are no trailing slashes or typos

---

### Issue: "Google Login Failed" error message

**Solution**:
- Check backend terminal for error messages
- Verify the Client ID in `backend/.env` matches the frontend
- Ensure backend `.env` has no extra spaces or quotes around the Client ID

---

### Issue: Backend shows "Google Auth Error"

**Solution**:
- The backend needs the same Client ID as the frontend
- Check `backend/.env` has the correct `GOOGLE_CLIENT_ID`
- Restart the backend server after changing `.env`

---

## 📝 Quick Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth Consent Screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added authorized JavaScript origins (`http://localhost:5173` and `http://localhost:5000`)
- [ ] Added authorized redirect URI (`http://localhost:5173`)
- [ ] Copied Client ID
- [ ] Updated `backend/.env` with Client ID
- [ ] Created `frontend/.env` with Client ID
- [ ] Updated `frontend/src/main.jsx` to use environment variable
- [ ] Restarted backend server
- [ ] Started/restarted frontend server
- [ ] Tested Google Sign-In button
- [ ] Successfully logged in with Google

---

## 🌍 Step 10: Production Deployment

When you deploy your app to production (e.g., Render, Netlify, Vercel), you **MUST** update your Google Cloud Console settings, otherwise Google Login will fail with a `redirect_uri_mismatch` error.

### 1. Update Authorized Origins & Redirects
1. Go back to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2. Click the **edit icon** (pencil) for your OAuth 2.0 Client ID.
3. Under **Authorized JavaScript origins**, click **+ ADD URI** and enter your production URL (e.g., `https://mindfulness-tracker.onrender.com`).
4. Under **Authorized redirect URIs**, click **+ ADD URI** and enter your production URL **WITHOUT** a trailing slash (e.g., `https://mindfulness-tracker.onrender.com`).
5. Click **SAVE**.

> ⚠️ **Note**: It may take up to 5-10 minutes for Google to update these settings.

### 2. Set Production Environment Variables
On your deployment platform (Render, Netlify, etc.), add the following environment variables in their dashboard:

- **Frontend Environment Variables**:
  - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID
  - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (or just `/api` if frontend is served by the backend)

- **Backend Environment Variables**:
  - `GOOGLE_CLIENT_ID`: Your Google Client ID
  - `JWT_SECRET`: A strong secret key
  - `MONGODB_URI`: Your production MongoDB connection string

---

## 🎉 Success!

Your Mindfulness Tracker is now equipped with secure Google Authentication for both local development and production! 

**Need Help?** If you encounter any "Error 400" screens, double-check your URLs in the Google Console. They must match EXACTLY.
