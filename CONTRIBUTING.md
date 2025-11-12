# Contributing to Student Mentor AI 🎓

Thank you for your interest in contributing to Student Mentor AI! This guide will help you get started with the project and ensure consistency across contributions.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- A code editor (we recommend **VS Code**)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### First Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/studentMentor.git
   cd studentMentor
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/harshareddy-bathala/studentMentor.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Verify setup**:
   Open `http://localhost:5173` in your browser

## 🏗️ Development Setup

### Recommended VS Code Extensions

Install these extensions for the best development experience:
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **TypeScript Error Translator** (`mattpocock.ts-error-translator`)
- **Error Lens** (`usernamehw.errorlens`)

### VS Code Settings

Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 📁 Project Structure

We follow a **feature-based architecture** for better scalability:

```
student-mentor-ai/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/
│   │   │   │   └── Login.tsx
│   │   │   └── types.ts
│   │   ├── onboarding/        # User onboarding
│   │   │   └── components/
│   │   │       └── Onboarding.tsx
│   │   ├── dashboard/         # Dashboard feature
│   │   │   └── components/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ActionBar.tsx
│   │   │       └── ...
│   │   ├── goals/             # Goals management
│   │   ├── homework/          # Homework tracking
│   │   ├── tests/             # Test management
│   │   ├── chat/              # AI mentor chat
│   │   ├── peer-chat/         # Peer/teacher messaging
│   │   ├── check-in/          # Daily check-in
│   │   └── reports/           # Teacher reports & alerts
│   │
│   ├── ui/                    # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   │
│   ├── common/                # Shared utilities
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── types/                 # TypeScript types
│   │   ├── student.types.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── setup.ts
│
├── public/                    # Static assets
└── docs/                      # Documentation
```

### Directory Guidelines

#### `features/`
- Each feature is self-contained with its own components, hooks, and logic
- Use feature folders for domain-specific functionality
- Keep features independent and reusable

#### `ui/`
- Reusable, presentational components
- Should be highly composable and accept props for customization
- No business logic or feature-specific code
- Well-documented with TypeScript interfaces

#### `common/`
- Shared utilities, hooks, and constants
- Helper functions used across multiple features
- Custom hooks that aren't feature-specific

## 🎨 Code Style Guidelines

### TypeScript

1. **Always use TypeScript** - No `any` types unless absolutely necessary
2. **Define interfaces** for all component props and data structures
3. **Use type inference** where possible
4. **Prefer interfaces over types** for object shapes

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Avoid
type ButtonProps = {
  label: any;
  onClick: Function;
};
```

### React Components

1. **Use functional components** with hooks
2. **One component per file** (except for small, tightly coupled components)
3. **Name files with PascalCase** matching the component name
4. **Export default** for main component, named exports for utilities

```typescript
// Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile`, `DashboardCard` |
| Functions | camelCase | `getUserData`, `calculateScore` |
| Variables | camelCase | `isLoading`, `studentName` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Types/Interfaces | PascalCase | `StudentProfile`, `ApiResponse` |
| Files (components) | PascalCase | `Login.tsx`, `UserCard.tsx` |
| Files (utils) | camelCase | `formatDate.ts`, `apiClient.ts` |

### Styling

1. **Use Tailwind CSS** for styling
2. **Extract repeated patterns** into reusable components
3. **Use semantic class names** in custom CSS
4. **Follow mobile-first** responsive design

```tsx
// ✅ Good - Tailwind with logical grouping
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
  Click me
</button>

// ✅ Good - Extracted component for reusability
<Button variant="primary" size="md">Click me</Button>
```

### Code Organization

1. **Import order**:
   ```typescript
   // 1. React imports
   import React, { useState, useEffect } from 'react';
   
   // 2. Third-party imports
   import { motion } from 'framer-motion';
   
   // 3. Internal imports (absolute)
   import Button from '@/ui/Button';
   import { StudentProfile } from '@/types';
   
   // 4. Relative imports
   import { formatDate } from './utils';
   
   // 5. Styles (if any)
   import './styles.css';
   ```

2. **Component structure**:
   ```typescript
   // 1. Imports
   // 2. Types/Interfaces
   // 3. Constants
   // 4. Component
   // 5. Helper functions (if small)
   // 6. Export
   ```

### Comments and Documentation

1. **Write self-documenting code** - Clear names over comments
2. **Use JSDoc** for complex functions
3. **Add comments for "why"**, not "what"
4. **Document props** with TypeScript interfaces

```typescript
/**
 * Calculates the student's average performance score based on
 * homework completion, test results, and check-in data.
 * 
 * @param studentId - The unique identifier of the student
 * @param timeRange - Number of days to include in calculation
 * @returns Average performance score (0-100)
 */
export function calculatePerformanceScore(
  studentId: string,
  timeRange: number = 30
): number {
  // Implementation
}
```

## 🔄 Git Workflow

### Branch Naming

Follow this convention:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation changes
- `test/description` - Test additions/changes

Examples:
- `feature/add-notification-system`
- `fix/login-validation-error`
- `refactor/reorganize-components`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(chat): add voice input support
fix(login): resolve authentication timeout issue
docs(readme): update setup instructions
refactor(dashboard): extract reusable chart components
test(homework): add unit tests for homework list
```

### Workflow Steps

1. **Sync with upstream**:
   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit regularly:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Run tests and linting** before pushing:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🧪 Testing

We use **Vitest** and **React Testing Library** for testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests

1. **Test file naming**: `ComponentName.test.tsx`
2. **Test location**: Colocate tests with components or in `tests/` directory
3. **Test structure**: Use `describe` and `it/test` blocks

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Testing Guidelines

- **Test behavior, not implementation**
- **Write tests for edge cases**
- **Mock external dependencies** (API calls, localStorage)
- **Aim for >80% code coverage**
- **Keep tests simple and readable**

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Self-review completed
- [ ] Meaningful commit messages

### PR Title Format

Use the same format as commit messages:
```
feat(chat): add voice input support
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **At least one reviewer** must approve
3. **Address all comments** or provide reasoning
4. **Squash commits** if needed for clean history
5. **Maintainer will merge** once approved

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Welcome newcomers** and help them learn
- **Provide constructive feedback**
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory remarks
- Publishing private information without permission
- Any conduct that could be deemed unprofessional

## 💡 Getting Help

### Resources

- **Documentation**: Check the [README.md](./README.md)
- **Issues**: Browse existing [GitHub Issues](https://github.com/harshareddy-bathala/studentMentor/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/harshareddy-bathala/studentMentor/discussions)

### Asking Questions

1. **Search first** - Check if your question was already answered
2. **Be specific** - Provide context and details
3. **Include examples** - Code snippets, error messages, screenshots
4. **Be patient** - Maintainers are volunteers

## 🎯 Areas to Contribute

### Good First Issues

Look for issues labeled:
- `good first issue` - Great for newcomers
- `help wanted` - We need your expertise
- `documentation` - Improve docs

### High Priority Areas

- **Testing**: Add more unit and integration tests
- **Accessibility**: Improve keyboard navigation and screen reader support
- **Performance**: Optimize rendering and bundle size
- **Documentation**: Enhance guides and examples
- **UI Components**: Build reusable component library

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Given credit in the project

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Student Mentor AI!** 🎓✨

Every contribution, no matter how small, helps make education better for students worldwide.
