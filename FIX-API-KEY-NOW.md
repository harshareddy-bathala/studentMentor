# 🔧 URGENT FIX: Your API Key Issue

## ✅ FIXED: Local .env.local file

I've corrected your `.env.local` file from:
```
GEMINI_API_KEY=AIzaSyBBLQTfgHXN0Es7v2TpftATl2MPpkbdCUE
```

To:
```
VITE_GEMINI_API_KEY=AIzaSyBBLQTfgHXN0Es7v2TpftATl2MPpkbdCUE
```

**The key issue**: Vite requires the `VITE_` prefix for environment variables!

---

## 🌐 For GitHub Pages (The site you're viewing)

Since you can't run the dev server locally due to group policy, you need to add the API key to GitHub Secrets:

### Step-by-Step Instructions:

1. **Go to your repository secrets page:**
   
   👉 Click this link: https://github.com/harshareddy-bathala/studentMentor/settings/secrets/actions
   
   Or manually:
   - Go to: https://github.com/harshareddy-bathala/studentMentor
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions" in the left sidebar

2. **Add the secret:**
   - Click the green **"New repository secret"** button
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Secret**: Paste your key → `AIzaSyBBLQTfgHXN0Es7v2TpftATl2MPpkbdCUE`
   - Click **"Add secret"**

3. **Trigger a rebuild:**
   After adding the secret, the site needs to rebuild. Do this:
   
   ```powershell
   # Make a small change to trigger rebuild
   git commit --allow-empty -m "Trigger rebuild with API key"
   git push origin main
   ```

4. **Wait 2-3 minutes** for GitHub Actions to rebuild and redeploy

5. **Refresh the page**: https://harshareddy-bathala.github.io/studentMentor/

---

## 🎯 Why This Happens

**Local Development** (localhost):
- Reads from `.env.local` file ✅ (now fixed with VITE_ prefix)

**GitHub Pages** (deployed site):
- CANNOT access your local `.env.local` file ❌
- Needs API key from GitHub Secrets ✅ (you need to add this)

---

## ⚡ Quick Commands (Run these after adding GitHub Secret)

```powershell
# Trigger rebuild
git commit --allow-empty -m "Trigger rebuild with API key"
git push origin main
```

---

## 🔒 Security Note

Your API key is now visible in this file. GitHub will automatically revoke it if you commit this file. The API key I saw is:

`AIzaSyBBLQTfgHXN0Es7v2TpftATl2MPpkbdCUE`

**Important**: 
- `.env.local` is in `.gitignore` so it won't be committed ✅
- But to be extra safe, consider regenerating the key after setup
- Only use GitHub Secrets for deployment (never hardcode keys in code)

---

## ✅ How to Verify It's Working

After adding to GitHub Secrets and pushing:

1. Go to: https://github.com/harshareddy-bathala/studentMentor/actions
2. Wait for the workflow to complete (green checkmark)
3. Visit: https://harshareddy-bathala.github.io/studentMentor/
4. Click "🤖 AI Mentor"
5. You should see the welcome message (no API error)
6. Click a quick prompt - it should send and get a response

---

## 🆘 Still Not Working?

**Check GitHub Actions logs:**
1. Go to: https://github.com/harshareddy-bathala/studentMentor/actions
2. Click the latest workflow run
3. Look for any errors in the build step

**Common issues:**
- Secret name must be exactly: `VITE_GEMINI_API_KEY` (case-sensitive)
- No spaces before or after the key
- Wait for Actions to complete before testing

---

**Next Steps:**
1. ✅ Local file fixed (VITE_ prefix added)
2. ⏳ Add to GitHub Secrets (you need to do this)
3. ⏳ Push empty commit to trigger rebuild
4. ⏳ Test deployed site

**Estimated time**: 5 minutes total
