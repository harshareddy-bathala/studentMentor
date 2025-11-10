# 🔐 URGENT: API Key Security Issue

## ⚠️ Your Previous API Key Was Exposed

GitHub detected that your API key was exposed in committed files. **You must revoke and regenerate it immediately.**

---

## 🚨 Step 1: Revoke the Old Key (DO THIS NOW)

1. Go to: https://aistudio.google.com/app/apikey
2. Find the key ending in `...pkbdCUE`
3. Click the trash/delete icon to revoke it
4. Confirm deletion

**Why?** The old key was in public files and could be used by anyone.

---

## 🔑 Step 2: Generate a New API Key

1. On the same page: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the new key (looks like: `AIzaSy...`)

---

## 📝 Step 3: Add New Key Locally

Edit the file `.env.local` in your project root:

```env
VITE_GEMINI_API_KEY=your_new_api_key_here
```

**Important:** Never commit this file to Git (it's already in .gitignore)

---

## 🌐 Step 4: Add Key to GitHub Secrets

For the deployed site to work:

1. Go to: https://github.com/harshareddy-bathala/studentMentor/settings/secrets/actions
2. Look for `VITE_GEMINI_API_KEY` secret
3. Click "Update" (pencil icon)
4. Paste your **new** API key
5. Click "Update secret"

---

## ✅ Step 5: Test

After adding the new key to GitHub Secrets:

1. Wait 2-3 minutes for auto-deployment
2. Visit: https://harshareddy-bathala.github.io/studentMentor/
3. Go to AI Mentor tab
4. You should see the welcome message and be able to chat

---

## 🔒 Security Best Practices

**NEVER:**
- ❌ Put API keys in code files
- ❌ Commit API keys to Git
- ❌ Share API keys in documentation files
- ❌ Post API keys in screenshots

**ALWAYS:**
- ✅ Use `.env.local` for local development
- ✅ Use GitHub Secrets for deployment
- ✅ Regenerate keys if exposed
- ✅ Keep `.env.local` in `.gitignore`

---

## 📊 What Was Fixed

- ✅ Removed all files containing the exposed key
- ✅ Cleaned up `.env.local` with placeholder
- ✅ Security commit pushed to GitHub
- ⏳ **YOU NEED TO**: Revoke old key and add new one

---

## 🆘 Need Help?

If chat still doesn't work after following all steps:
1. Check GitHub Actions: https://github.com/harshareddy-bathala/studentMentor/actions
2. Verify secret name is exactly: `VITE_GEMINI_API_KEY`
3. Make sure the new key is valid
4. Hard refresh browser: Ctrl + Shift + R

---

**Time to fix:** 5 minutes
**Priority:** 🔴 HIGH (Security issue)
