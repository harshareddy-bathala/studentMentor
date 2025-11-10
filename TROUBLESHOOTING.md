# 🔧 Troubleshooting Guide - Student Mentor AI

## Issue: CSS Not Loading / Styles Not Applying

If you see the app rendering with **no styling** (white background, black text, plain HTML), follow these steps:

### ✅ Solution 1: Clear Cache and Restart Dev Server

1. **Stop the dev server** (if running):
   - Press `Ctrl + C` in the terminal

2. **Clear build artifacts**:
   ```powershell
   Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **Restart the dev server**:
   ```powershell
   npm run dev
   ```

4. **Hard refresh browser**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

### ✅ Solution 2: Fix PowerShell Execution Policy (if blocked)

If you get "This program is blocked by group policy", try:

**Option A - Use CMD instead**:
```cmd
cd C:\Users\BATHALAHARSHAVARDHAN\Desktop\Projects\student-mentor-ai
npm run dev
```

**Option B - Use npx directly**:
```powershell
npx vite
```

**Option C - Change PowerShell Execution Policy** (requires admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ✅ Solution 3: Verify Tailwind CSS Configuration

Check that these files exist and are properly configured:

1. **tailwind.config.js** - Should include all component paths
2. **postcss.config.js** - Should include tailwindcss plugin
3. **index.css** - Should have `@tailwind` directives at the top
4. **index.tsx** - Should import `./index.css`

### ✅ Solution 4: Port Already in Use

If port 3000 is occupied:

```powershell
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
$env:PORT=3001; npm run dev
```

### ✅ Solution 5: Node Modules Issue

If Tailwind still won't load:

```powershell
# Remove and reinstall dependencies
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
npm run dev
```

## Issue: Navbar Appears Twice

**Fixed!** The duplicate navigation has been removed. Only one navbar exists in `App.tsx`.

## Issue: User Dropdown Menu Not Working

The dropdown menu should appear on hover. If it doesn't work:

1. **Ensure CSS is loading** (see Solution 1 above)
2. **Check Tailwind is processing `group-hover`** utilities
3. **Verify browser supports CSS hover** (all modern browsers do)

## Issue: Dark Mode Not Applied

If the background is white instead of dark slate:

1. **Check** that `body` element has `class="bg-slate-900 text-slate-100"` in `index.html`
2. **Verify** Tailwind CSS is being compiled (see Solution 1)
3. **Confirm** `index.css` is being imported in `index.tsx`

## Quick Diagnostic Checklist

- [ ] Dev server is running on `http://localhost:3000`
- [ ] Browser console shows no errors
- [ ] Network tab shows `index.css` is loaded
- [ ] No "Module not found" errors
- [ ] `.env.local` file exists with `VITE_GEMINI_API_KEY`
- [ ] Node version is 18 or higher (`node --version`)

## Still Having Issues?

### Check Browser Console

1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Look for errors (red text)
4. Check **Network** tab - ensure CSS files are loaded (status 200)

### Verify File Structure

Ensure these critical files exist:
```
student-mentor-ai/
├── index.html
├── index.tsx
├── index.css
├── App.tsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── package.json
└── .env.local
```

### Check Vite Config

The `vite.config.ts` should have:
```typescript
base: mode === 'production' ? '/studentMentor/' : '/',
```

This ensures the base path is `/` for local development.

## Common Mistakes

❌ **Running `npm run build` instead of `npm run dev`**
- Use `npm run dev` for development
- Use `npm run build` only for production

❌ **Wrong directory**
- Make sure you're in the project root
- Run `pwd` to check current directory

❌ **Missing API key**
- Create `.env.local` with your Gemini API key
- Get key from: https://aistudio.google.com/app/apikey

❌ **Browser cache**
- Always hard refresh after code changes
- Or use incognito mode for testing

## Development Tips

### Recommended Setup

1. **Use VSCode** with extensions:
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Prettier

2. **Keep DevTools open** while developing

3. **Watch terminal output** for build errors

4. **Use browser's responsive mode** to test mobile views

### Clean Restart Command

Create a file `restart-dev.ps1`:
```powershell
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Starting dev server..." -ForegroundColor Green
npm run dev
```

Then run: `.\restart-dev.ps1`

---

**Need more help?** Check the main README.md for full setup instructions.
