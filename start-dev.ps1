Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Clean complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host "📍 App will be available at: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
npm run dev
