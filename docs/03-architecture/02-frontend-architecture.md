# 🎨 Frontend Architecture

## Overview

The OriginStamp ICP frontend is built with modern React 18 and TypeScript, following best practices for scalability, maintainability, and user experience. The architecture emphasizes type safety, component reusability, and performance optimization.

## 🏗️ Architecture Principles

### 1. **Component-First Design**

- Modular, reusable components
- Clear separation of concerns
- Consistent component patterns
- TypeScript interfaces for all props

### 2. **State Management**

- React Context for global state
- Local state with hooks
- Optimized re-renders
- Predictable state updates

### 3. **Performance Optimization**

- Code splitting and lazy loading
- Memoization and optimization
- Efficient bundle size
- Fast loading times

### 4. **Developer Experience**

- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot module replacement
- Comprehensive testing

## 📁 Project Structure

```
src/frontend/src/
├── components/              # Reusable UI components
│   ├── common/             # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Loader.tsx
│   │   └── index.ts
│   ├── auth/              # Authentication components
│   │   ├── Login.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   ├── dashboard/         # Dashboard components
│   │   ├── Dashboard.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── DashboardStats.tsx
│   │   └── index.ts
│   ├── marketplace/       # Marketplace components
│   │   ├── CollectionCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── index.ts
│   ├── layout/           # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   └── ui/               # UI elements
│       ├── ThemeToggle.tsx
│       ├── LanguageToggle.tsx
│       └── index.ts
├── pages/                # Page-level components
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── index.ts
│   ├── marketplace/
│   │   ├── MarketplacePage.tsx
│   │   └── index.ts
│   └── index.ts
├── contexts/             # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── ToastContext.tsx
│   └── index.ts
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useToast.ts
│   └── index.ts
├── services/             # API service layer
│   ├── authService.ts
│   ├── sessionService.ts
│   ├── nftService.ts
│   └── index.ts
├── types/                # TypeScript type definitions
│   ├── auth.ts
│   ├── session.ts
│   ├── nft.ts
│   └── index.ts
├── utils/                # Utility functions
│   ├── validation.ts
│   ├── formatting.ts
│   ├── constants.ts
│   └── index.ts
├── css/                  # ITCSS architecture styles
│   ├── main.scss
│   ├── settings/
│   ├── tools/
│   ├── generic/
│   ├── elements/
│   ├── objects/
│   ├── components/
│   └── utilities/
├── locales/              # Internationalization
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   └── dashboard.json
│   └── id/
│       ├── common.json
│       ├── auth.json
│       └── dashboard.json
├── App.tsx               # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── AuthProvider
├── ThemeProvider
├── ToastProvider
└── Router
    ├── PublicRoutes
    │   ├── LoginPage
    │   └── LandingPage
    └── ProtectedRoutes
        ├── DashboardPage
        ├── SessionPage
        └── MarketplacePage
```

### Component Patterns

#### 1. **Functional Components with TypeScript**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### 2. **Compound Components**

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
} = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

Card.Header = ({ children }) => (
  <div className="card__header">{children}</div>
);

Card.Body = ({ children }) => (
  <div className="card__body">{children}</div>
);
```

#### 3. **Render Props Pattern**

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}

export const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  return <>{children(data, loading, error)}</>;
};
```

## 🔄 State Management

### Context-Based State Management

#### 1. **Authentication Context**

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    // Implementation
  };

  const logout = () => {
    // Implementation
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2. **Theme Context**

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Custom Hooks

#### 1. **useAuth Hook**

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

#### 2. **useLocalStorage Hook**

```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## 🎨 Styling Architecture

### ITCSS Methodology

#### 1. **Settings Layer**

```scss
// _settings.scss
:root {
  // Colors
  --color-primary: #1a1a1a;
  --color-secondary: #f8f9fa;
  --color-accent: #007bff;

  // Typography
  --font-family-base: "Inter", sans-serif;
  --font-family-mono: "Courier New", monospace;

  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

#### 2. **Components Layer**

```scss
// _buttons.scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  font-family: var(--font-family-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &--primary {
    background-color: var(--color-accent);
    color: white;

    &:hover {
      background-color: darken(var(--color-accent), 10%);
    }
  }
}
```

## 🔧 Performance Optimization

### 1. **Code Splitting**

```typescript
// Lazy loading of pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const MarketplacePage = lazy(() => import('./pages/marketplace/MarketplacePage'));

// Route-based code splitting
<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/marketplace" element={<MarketplacePage />} />
  </Routes>
</Suspense>
```

### 2. **Memoization**

```typescript
// Memoized components
export const ExpensiveComponent = memo<ExpensiveComponentProps>(({ data }) => {
  return (
    <div>
      {data.map(item => (
        <DataItem key={item.id} item={item} />
      ))}
    </div>
  );
});

// Memoized callbacks
const handleClick = useCallback((id: string) => {
  // Handle click
}, []);
```

### 3. **Bundle Optimization**

```typescript
// Tree shaking friendly imports
import { Button } from "./components/common/Button";
import { Card } from "./components/common/Card";

// Dynamic imports for heavy libraries
const HeavyLibrary = lazy(() => import("heavy-library"));
```

## 🌐 Internationalization

### React i18n Setup

```typescript
// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import idCommon from "./locales/id/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
    },
    id: {
      common: idCommon,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

export const WelcomeMessage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <h1>{t('welcome.title')}</h1>
  );
};
```

## 🧪 Testing Architecture

### Testing Strategy

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔗 Integration Patterns

### API Integration

```typescript
// Service layer pattern
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return response.json();
    } catch (error) {
      throw new Error("Network error");
    }
  }
}
```

### Error Handling

```typescript
// Error boundary component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 📱 Responsive Design

### Mobile-First Approach

```scss
// Base styles (mobile)
.card {
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

// Tablet and up
@media (min-width: 768px) {
  .card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
}

// Desktop and up
@media (min-width: 1024px) {
  .card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
}
```

## 🔒 Security Considerations

### Input Validation

```typescript
// Form validation
const validateForm = (data: FormData): ValidationResult => {
  const errors: string[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Invalid email address");
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### XSS Prevention

```typescript
// Safe content rendering
import DOMPurify from 'dompurify';

const SafeContent: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};
```

## 📚 Related Documentation

- **[CSS Architecture](../04-frontend/02-css-architecture.md)** - ITCSS methodology
- **[Component Guidelines](../04-frontend/03-component-guidelines.md)** - Component patterns
- **[UI Components](../04-frontend/01-ui-components.md)** - Component library
- **[Backend Architecture](./03-backend-architecture.md)** - Backend integration

---

_This frontend architecture provides a solid foundation for building scalable, maintainable, and user-friendly React applications._
