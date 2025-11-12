# Setup Instructions for Linting, Formatting, and Testing

## Overview

This document provides step-by-step instructions to set up the development environment with linting, formatting, testing, and pre-commit hooks.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Stable internet connection

## Step 1: Install Development Dependencies

Run this command to install all necessary development dependencies:

```powershell
npm install --save-dev `
  eslint `
  @typescript-eslint/parser `
  @typescript-eslint/eslint-plugin `
  eslint-plugin-react `
  eslint-plugin-react-hooks `
  eslint-plugin-react-refresh `
  eslint-plugin-jsx-a11y `
  eslint-config-prettier `
  prettier `
  prettier-plugin-tailwindcss `
  husky `
  lint-staged `
  @vitest/coverage-v8
```

**Note**: If you encounter network errors, try:
- Checking your internet connection
- Running the command again
- Installing packages one at a time
- Using `npm cache clean --force` and retrying

## Step 2: Initialize Husky (Git Hooks)

After installing dependencies, initialize Husky:

```powershell
npx husky install
```

## Step 3: Create Pre-commit Hook

Create a pre-commit hook that runs linting and formatting:

```powershell
npx husky add .husky/pre-commit "npx lint-staged"
```

**Manually (if above fails)**:
1. Create `.husky/pre-commit` file
2. Add this content:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```
3. Make it executable (on Linux/Mac): `chmod +x .husky/pre-commit`

## Step 4: Verify Configuration Files

Ensure these files exist in your project root:

### `.eslintrc.cjs`
✅ Already created

### `.prettierrc`
✅ Already created

### `.lintstagedrc`
✅ Already created

### `.eslintignore`
✅ Already created

### `.prettierignore`
✅ Already created

### `vitest.config.ts`
✅ Already created

### `tests/setup.ts`
✅ Already created

## Step 5: Test the Setup

### Test Linting

```powershell
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Test Formatting

```powershell
# Check formatting
npm run format:check

# Format all files
npm run format
```

### Test Type Checking

```powershell
npm run type-check
```

### Run Tests

```powershell
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Step 6: Available npm Scripts

After setup, you'll have these scripts available:

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Fix linting errors |
| `npm run format` | Format all files |
| `npm run format:check` | Check file formatting |
| `npm run type-check` | Check TypeScript types |
| `npm run prepare` | Install Husky hooks |

## Step 7: Git Workflow with Pre-commit Hooks

Once Husky is set up, every time you commit:

1. **Stage your changes**:
   ```powershell
   git add .
   ```

2. **Commit**:
   ```powershell
   git commit -m "feat: your feature description"
   ```

3. **Pre-commit hook runs automatically**:
   - Lints your code
   - Formats your code
   - Runs type checking
   - If any errors, commit is blocked
   - Fix errors and try again

## Troubleshooting

### Issue: Husky hooks not running

**Solution**:
```powershell
# Reinitialize Husky
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Issue: ESLint errors on existing code

**Solution**:
```powershell
# Fix all auto-fixable issues
npm run lint:fix

# For remaining issues, fix manually or add exceptions
```

### Issue: Prettier formatting conflicts with ESLint

**Solution**:
- Already handled by `eslint-config-prettier` in `.eslintrc.cjs`
- Always run `npm run format` after `npm run lint:fix`

### Issue: Tests failing

**Solution**:
1. Check test output for specific errors
2. Ensure all dependencies are installed
3. Run `npm run test` to see detailed error messages
4. Fix the test or the code causing the failure

### Issue: Pre-commit hook runs but doesn't fail on errors

**Solution**:
Check `.lintstagedrc` configuration and ensure hooks are executable.

## Step 8: Editor Integration (VS Code)

### Install Extensions

Install these VS Code extensions:
1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

### Configure VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Step 9: Writing Tests

### Test File Structure

```
tests/
├── unit/               # Unit tests for functions/components
│   ├── ui/            # UI component tests
│   └── utils/         # Utility function tests
├── integration/        # Integration tests
└── setup.ts           # Test setup and mocks
```

### Example Unit Test

```typescript
// tests/unit/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/common/utils/formatDate';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-01');
    expect(formatDate(date)).toBe('Jan 1, 2025');
  });
});
```

### Example Component Test

```typescript
// tests/unit/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

## Step 10: Continuous Integration (Optional)

Add a GitHub Actions workflow for CI:

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Test
        run: npm run test
      
      - name: Build
        run: npm run build
```

## Summary

After completing these steps, you'll have:

- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Husky for Git hooks
- ✅ lint-staged for pre-commit checks
- ✅ Vitest for testing
- ✅ VS Code integration
- ✅ Automated quality checks on commit

## Next Steps

1. **Run setup commands** (when network is stable)
2. **Verify everything works** using test commands
3. **Start restructuring** using `RESTRUCTURING_GUIDE.md`
4. **Write tests** for new components
5. **Follow** `CONTRIBUTING.md` for development guidelines

---

**Note**: If you encounter any issues during setup, refer to the Troubleshooting section or check the documentation for specific tools.
