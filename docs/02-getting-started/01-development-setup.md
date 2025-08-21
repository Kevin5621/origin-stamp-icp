# 🛠️ Development Setup

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Kevin5621/origin-stamp-icp.git
cd originstamp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
# Start everything for development (DFX + Backend + Frontend)
npm run dev

# Or start frontend only (if backend is already running)
npm start

# Or start full deployment (production-like)
npm run deploy
```

## 📁 Project Structure

```
src/frontend/
├── src/
│   ├── pages/                # Page components
│   ├── components/           # Reusable components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   └── css/                  # Styles (ITCSS)
├── public/                   # Static assets
├── tests/                    # Test files
└── package.json              # Dependencies
```

## 🔧 Available Scripts

```bash
# Development
npm run dev            # Start everything (DFX + Backend + Frontend)
npm start              # Start frontend only
npm run build          # Build for production
npm run preview        # Preview production build
```

# Testing

npm test # Run all tests
npm run test:frontend # Frontend tests only

# Deployment

npm run deploy # Full deployment
npm run deploy:frontend # Frontend only

````

## 🎨 Styling

### CSS Architecture (ITCSS)

- **Settings**: Variables and configuration
- **Generic**: Reset and base styles
- **Elements**: HTML element styles
- **Objects**: Layout objects
- **Components**: Component-specific styles
- **Utilities**: Helper classes

### Key Files

- `src/css/main.scss` - Main stylesheet
- `src/css/settings/_settings.scss` - CSS variables
- `src/css/components/` - Component styles

## 🔧 Development Tools

### TypeScript

- Strict mode enabled
- Path aliases configured
- Type checking on build

### ESLint & Prettier

- Code formatting
- Linting rules
- Auto-fix on save

### Vite

- Fast development server
- Hot module replacement
- Optimized builds

## 🧪 Testing

### Test Setup

```bash
# Run tests
npm test

````

### Testing Libraries

- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **Jest DOM**: DOM matchers

## 🌐 Internationalization

### Translation Files

```
src/locales/
├── en/
│   └── translation.json
└── id/
    └── translation.json
```

### Usage

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('welcome_message')}</h1>;
```

## 🚀 Deployment

### Local Development

```bash
# Start DFX
dfx start --clean

# Deploy canisters
npm run deploy:backend

# Deploy frontend
npm run deploy:frontend
```

### Production

```bash
# Build
npm run build

```

## 🔍 Debugging

### Browser DevTools

- React DevTools extension
- Network tab for API calls
- Console for errors

### VS Code Extensions

- TypeScript and JavaScript
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Testing](https://vitest.dev/)
