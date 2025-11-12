# Quick Reference - Development Commands

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

## 🔧 Development

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## ✨ Code Quality

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format all files
npm run format

# TypeScript type checking
npm run type-check
```

## 🔄 Git Workflow

```bash
# Stage changes
git add .

# Commit (triggers pre-commit hooks)
git commit -m "feat: your feature description"

# Push to remote
git push origin your-branch-name
```

### Commit Message Format

```
<type>(<scope>): <subject>

Examples:
feat(chat): add voice input support
fix(login): resolve authentication timeout
docs(readme): update setup instructions
test(homework): add unit tests
refactor(dashboard): extract chart components
style(ui): format button component
chore(deps): update dependencies
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📦 Dependencies

```bash
# Install new dependency
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

## 🐛 Troubleshooting

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Husky hooks
rm -rf .husky
npx husky install

# Check for type errors
npm run type-check

# View detailed test output
npm run test -- --reporter=verbose
```

## 🔍 Useful VS Code Commands

```
Ctrl+Shift+P          Open command palette
Ctrl+P                Quick file open
Ctrl+Shift+F          Search across files
Ctrl+`                Toggle terminal
F2                    Rename symbol
Shift+Alt+F           Format document
Ctrl+.                Quick fix
```

## 📚 Documentation

- **Setup Guide**: `SETUP_INSTRUCTIONS.md`
- **Contributing**: `CONTRIBUTING.md`
- **Architecture**: `RESTRUCTURING_GUIDE.md`
- **Improvements**: `PROJECT_IMPROVEMENTS.md`

## 🆘 Common Issues

### Issue: Port already in use
```bash
# Kill process on port 5173 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### Issue: Husky hooks not running
```bash
# Reinitialize Husky
npx husky install
```

### Issue: Tests failing after update
```bash
# Clear test cache
npm run test -- --clearCache
```

### Issue: Build fails
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

## 🎯 Before Pushing

Always run these before pushing:

```bash
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run type-check    # Check types
npm run test          # Run tests
npm run build         # Verify build works
```

Or run all at once:
```bash
npm run lint:fix && npm run format && npm run type-check && npm run test && npm run build
```

## 🚀 Production Deployment

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Output is in dist/ directory
```

## 📊 Project Stats

```bash
# Count lines of code (requires cloc)
cloc . --exclude-dir=node_modules,dist

# Check bundle size
npm run build
du -sh dist/

# Analyze dependencies
npm list --depth=0
```

---

**Tip**: Add this file to your bookmarks for quick access to commands!
