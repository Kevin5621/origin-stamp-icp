# 🎨 Frontend Development

Welcome to the frontend development documentation for OriginStamp ICP. This section covers all aspects of the React/TypeScript frontend application.

## 🏗️ Architecture Overview

The frontend is built with modern React practices and follows a well-structured architecture:

```
src/frontend/src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── contexts/           # React contexts (Auth, Theme, Toast)
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── css/                # ITCSS architecture styles
└── locales/            # Internationalization files
```

## 📚 Development Guides

### 1. [UI Components](./01-ui-components.md)

Comprehensive guide to the component library:

- Component structure and patterns
- Design system principles
- Reusable component examples
- Testing strategies

### 2. [CSS Architecture](./02-css-architecture.md)

Detailed ITCSS methodology implementation:

- Layer structure and organization
- CSS custom properties system
- Responsive design patterns
- Performance optimization

### 3. [Component Guidelines](./03-component-guidelines.md)

In-depth CSS component documentation:

- Dashboard components
- Form components
- Navigation components
- Modal and overlay components
- Best practices and patterns

### 4. [Icon Standards](./04-icon-standards.md)

Icon usage and sizing standards:

- Icon size hierarchy
- Implementation guidelines
- Button icon patterns
- Accessibility considerations

### 5. [Typography Guide](./05-typography-guide.md)

Typography system and standards:

- Font stack configuration
- Professional number styling
- Utility classes
- Responsive typography

## 🎯 Key Features

### Component System

- **Modular Design**: Reusable components with clear interfaces
- **TypeScript Integration**: Full type safety and IntelliSense
- **Internationalization**: Multi-language support with react-i18n
- **Theme Support**: Light/dark theme switching
- **Responsive Design**: Mobile-first approach

### Styling Architecture

- **ITCSS Methodology**: Inverted Triangle CSS for maintainability
- **CSS Custom Properties**: Dynamic theming and configuration
- **BEM Naming**: Consistent class naming conventions
- **Performance Optimized**: Efficient CSS delivery

### Development Experience

- **Hot Reload**: Fast development with Vite
- **Type Safety**: Full TypeScript coverage
- **Testing**: Comprehensive test suite
- **Linting**: ESLint and Prettier configuration

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 Design System

### Color Palette

```scss
// Primary colors
--color-primary-text: #1a1a1a;
--color-surface: #ffffff;
--color-primary-bg: #f8f9fa;

// Status colors
--color-success: #10b981;
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-info: #3b82f6;
```

### Typography

```scss
// Font families
--font-family-mono: "Courier New", monospace;
--font-family-numbers: "Inter", system-ui, sans-serif;

// Font weights
--font-weight-bold: 700;
--font-weight-semibold: 600;
```

### Spacing System

```scss
// Spacing scale
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

## 🔧 Development Tools

### Essential Extensions

- **TypeScript and JavaScript**
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **React Developer Tools**

### Useful Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run type-check

# Storybook (if available)
npm run storybook
```

## 📖 Best Practices

### Component Development

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Always define TypeScript interfaces
3. **Default Values**: Provide sensible defaults for optional props
4. **Error Boundaries**: Implement proper error handling
5. **Accessibility**: Include ARIA labels and keyboard navigation

### Styling Guidelines

1. **Semantic Classes**: Use meaningful class names
2. **CSS Variables**: Leverage custom properties for theming
3. **Mobile First**: Start with mobile styles, enhance for desktop
4. **Performance**: Minimize CSS bundle size
5. **Consistency**: Follow established patterns

## 🔗 Related Documentation

- **[Backend Development](../05-backend/)** - API integration
- **[Integration Guides](../06-integration/)** - Frontend-backend integration
- **[Development Resources](../07-development/)** - Coding standards

## 🆘 Troubleshooting

Common frontend issues and solutions:

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Regenerate declarations
dfx generate
```

### Styling Issues

```bash
# Rebuild CSS
npm run build:css

# Check CSS compilation
npm run lint:css
```

---

_Ready to build amazing UI components? Start with the [UI Components](./01-ui-components.md) guide!_
