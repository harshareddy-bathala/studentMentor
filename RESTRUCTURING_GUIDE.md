# Project Restructuring Guide

This document explains the recommended changes to organize the Student Mentor AI codebase for better scalability and maintainability.

## 🎯 Goals

1. **Feature-based organization** - Group related files together
2. **Shared UI components** - Reusable building blocks
3. **Clear separation of concerns** - Domain logic vs. presentation
4. **Better testability** - Easier to test isolated features
5. **Scalability** - Easy to add new features without cluttering

## 📁 Current Structure

```
student-mentor-ai/
├── components/           # All components mixed together
│   ├── Login.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── Chat.tsx
│   ├── ...
├── utils/
│   └── aiHelpers.ts
├── types.ts
├── authTypes.ts
└── App.tsx
```

## 📁 Recommended Structure

```
student-mentor-ai/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── Login.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   └── Onboarding.tsx
│   │   │   ├── steps/
│   │   │   │   ├── BasicInfo.tsx
│   │   │   │   ├── Academics.tsx
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── ActionBar.tsx
│   │   │   │   ├── HeroCard.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardData.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── goals/
│   │   │   ├── components/
│   │   │   │   └── GoalsEditor.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── homework/
│   │   │   ├── components/
│   │   │   │   └── HomeworkList.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── components/
│   │   │   │   └── TestsList.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   └── ChatDrawer.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useChat.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── peer-chat/
│   │   │   ├── components/
│   │   │   │   └── PeerChat.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── check-in/
│   │   │   ├── components/
│   │   │   │   └── DailyCheckIn.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── reports/
│   │       ├── components/
│   │       │   ├── TeacherReport.tsx
│   │       │   └── TeacherAlerts.tsx
│   │       └── index.ts
│   │
│   ├── ui/                    # Shared UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── index.ts
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── Select/
│   │   │   ├── Select.tsx
│   │   │   └── index.ts
│   │   ├── Spinner/
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   └── index.ts            # Barrel export
│   │
│   ├── common/                # Shared utilities
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   ├── validation.ts
│   │   │   ├── aiHelpers.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── types/                 # TypeScript types
│   │   ├── student.types.ts
│   │   ├── auth.types.ts
│   │   ├── chat.types.ts
│   │   ├── homework.types.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── tests/                     # Test files
│   ├── unit/
│   │   ├── ui/
│   │   │   ├── Button.test.tsx
│   │   │   └── Card.test.tsx
│   │   └── utils/
│   │       └── aiHelpers.test.ts
│   ├── integration/
│   │   ├── App.test.tsx
│   │   └── auth.test.tsx
│   └── setup.ts
│
├── public/                    # Static assets
│   └── favicon_io/
│
├── docs/                      # Documentation
│   ├── architecture.md
│   ├── api-design.md
│   └── deployment.md
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .husky/                    # Git hooks
│   └── pre-commit
│
├── .eslintrc.cjs
├── .prettierrc
├── .lintstagedrc
├── CONTRIBUTING.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 🔄 Migration Steps

### Phase 1: Create Directory Structure

```bash
# PowerShell commands
mkdir src
mkdir src\features
mkdir src\features\auth\components
mkdir src\features\onboarding\components
mkdir src\features\dashboard\components
mkdir src\features\goals\components
mkdir src\features\homework\components
mkdir src\features\tests\components
mkdir src\features\chat\components
mkdir src\features\peer-chat\components
mkdir src\features\check-in\components
mkdir src\features\reports\components
mkdir src\ui
mkdir src\common\hooks
mkdir src\common\utils
mkdir src\common\constants
mkdir src\types
mkdir docs
```

### Phase 2: Move Components to Features

```bash
# Auth feature
mv components\Login.tsx src\features\auth\components\
mv authTypes.ts src\features\auth\types.ts

# Onboarding feature
mv components\Onboarding.tsx src\features\onboarding\components\

# Dashboard feature
mv components\Dashboard.tsx src\features\dashboard\components\
mv components\dashboard\*.tsx src\features\dashboard\components\

# Goals feature
mv components\GoalsEditor.tsx src\features\goals\components\

# Homework feature
mv components\HomeworkList.tsx src\features\homework\components\

# Tests feature
mv components\TestsList.tsx src\features\tests\components\

# Chat feature
mv components\Chat.tsx src\features\chat\components\
mv components\chat\*.tsx src\features\chat\components\

# Peer chat feature
mv components\PeerChat.tsx src\features\peer-chat\components\

# Check-in feature
mv components\DailyCheckIn.tsx src\features\check-in\components\

# Reports feature
mv components\TeacherReport.tsx src\features\reports\components\
mv components\TeacherAlerts.tsx src\features\reports\components\

# Navigation (could be in common or its own feature)
mv components\Navigation.tsx src\features\navigation\components\
```

### Phase 3: Extract Shared UI Components

Create new reusable components in `src/ui/`:

1. **Button Component** (`src/ui/Button/Button.tsx`):
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
```

2. **Card Component** (`src/ui/Card/Card.tsx`):
```tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, title, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
```

3. **Input Component** (`src/ui/Input/Input.tsx`):
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

4. **Badge Component** (`src/ui/Badge/Badge.tsx`):
```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}
```

5. **Modal Component** (`src/ui/Modal/Modal.tsx`):
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-xl ${sizeStyles[size]} w-full mx-4`}>
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
```

### Phase 4: Create Barrel Exports

Create `index.ts` files for clean imports:

**src/ui/index.ts**:
```typescript
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
export { default as Modal } from './Modal';
```

**src/features/auth/index.ts**:
```typescript
export { default as Login } from './components/Login';
export * from './types';
```

### Phase 5: Update Import Paths

Update all imports in existing files. Example:

**Before**:
```typescript
import Login from '../../components/Login';
import { StudentProfile } from '../../types';
```

**After**:
```typescript
import { Login } from '@/features/auth';
import { StudentProfile } from '@/types';
import { Button, Card } from '@/ui';
```

### Phase 6: Update Build Configuration

Update `vite.config.ts` and `tsconfig.json` for path aliases:

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/common': path.resolve(__dirname, './src/common'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
});
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    // ... existing config
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/ui": ["src/ui"],
      "@/features/*": ["src/features/*"],
      "@/common/*": ["src/common/*"],
      "@/types": ["src/types"]
    }
  }
}
```

## ✅ Benefits

### Before
- ❌ All components in one flat directory
- ❌ Hard to find related files
- ❌ Difficult to understand feature scope
- ❌ Duplicated UI code across components

### After
- ✅ Clear feature boundaries
- ✅ Related files grouped together
- ✅ Easy to add new features
- ✅ Reusable UI components
- ✅ Better testability
- ✅ Easier onboarding for new developers

## 📚 Additional Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Folder Structure Best Practices](https://www.robinwieruch.de/react-folder-structure/)
- [Component-Driven Development](https://www.componentdriven.org/)

## 🎯 Next Steps

1. ✅ Create CONTRIBUTING.md with guidelines
2. ✅ Setup ESLint and Prettier
3. ✅ Configure Husky and lint-staged
4. ✅ Add test infrastructure
5. ⏳ Implement the restructuring plan
6. ⏳ Update documentation
7. ⏳ Create example UI components
8. ⏳ Update imports across the codebase

---

**Note**: This is a phased approach. Start with Phase 1-2 to establish the structure, then gradually migrate components while maintaining a working application.
