# 🔑 Quick API Key Setup Guide

## The Issue You're Seeing

You're seeing an error message in the chat because the Gemini API key is not configured. This is required for the AI mentor to work.

## ✅ How to Fix (Takes 2 minutes)

### Step 1: Get Your Free API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (looks like: `AIzaSyAbc123...`)

### Step 2: Add the Key to Your Project

1. **Create a file** named `.env.local` in your project root folder:
   ```
   student-mentor-ai/
   ├── .env.local  ← CREATE THIS FILE
   ├── App.tsx
   ├── package.json
   └── ...
   ```

2. **Add this line** to the file (replace with your actual key):
   ```env
   VITE_GEMINI_API_KEY=AIzaSyAbc123YourActualKeyHere
   ```

3. **Save the file**

### Step 3: Restart the Development Server

Since the dev server is blocked by group policy, you'll need to test this after deploying to GitHub Pages.

## 🚀 For GitHub Pages Deployment

Since you're deploying to GitHub Pages, add the API key as a GitHub Secret:

1. Go to: https://github.com/harshareddy-bathala/studentMentor/settings/secrets/actions

2. Click **"New repository secret"**

3. Enter:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Secret**: Your actual API key (paste the full key)

4. Click **"Add secret"**

5. The next time you push to GitHub, the Actions workflow will automatically rebuild with your API key!

## 🎯 What Gets Fixed

Once you add the API key:

✅ **Quick prompts will work** - Click them and they'll automatically send to the AI
✅ **You can type and send messages** - No more errors
✅ **AI will respond** - Smart, contextual responses based on your homework, tests, and goals
✅ **Teacher alerts** - AI can detect when you need help and notify teachers

## 🔒 Security Note

The `.env.local` file is automatically ignored by Git (it's in `.gitignore`), so your API key will never be committed to the repository. This keeps it secure!

For GitHub Pages, the API key is stored as a GitHub Secret, which is encrypted and secure.

## ⚡ Quick Test After Setup

1. Open the chat (🤖 AI Mentor tab)
2. You should see the welcome message (no error)
3. Click any quick prompt - it should automatically send
4. Type a message and press Enter - AI should respond

## 🆘 Still Having Issues?

**Error: "API key not configured"**
→ Make sure the file is named exactly `.env.local` (with the dot at the start)
→ Make sure you used `VITE_GEMINI_API_KEY=` (with VITE_ prefix)
→ No spaces around the `=` sign
→ Restart your dev server after creating the file

**Quick prompts still not working?**
→ Clear your browser cache (Ctrl+Shift+R)
→ Make sure you pulled the latest code from GitHub

**Need more help?**
→ Check the API key is valid at https://aistudio.google.com/app/apikey
→ Look at the browser console (F12) for detailed error messages

---

**Created**: November 10, 2025
**Status**: ✅ Chat fixes pushed to GitHub (commit: 26a29b9)
