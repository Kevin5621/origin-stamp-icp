# 🎨 UI Components

## Overview

OriginStamp uses a modular component system with neumorphic design principles. All components are built with TypeScript and follow consistent design patterns.

## 🏗️ Component Structure

```
src/components/
├── common/                    # Reusable components
│   ├── Button.tsx            # Button variants
│   ├── Card.tsx              # Card container
│   ├── InputField.tsx        # Form inputs
│   ├── Loader.tsx            # Loading states
│   ├── Modal.tsx             # Modal dialogs
│   └── Toast.tsx             # Notifications
├── login/                    # Authentication
│   ├── Login.tsx             # Main login component
│   └── LoginForm.tsx         # Login form
├── profile/                  # User profile
│   └── TransformableAvatar.tsx # User avatar
├── header/                   # Navigation
│   └── AppHeader.tsx         # Main header
├── navigation/               # Navigation
│   └── AppNavigation.tsx     # Navigation menu
└── ui/                       # UI elements
    ├── ErrorDisplay.tsx      # Error messages
    ├── LanguageToggle.tsx    # Language switcher
    └── ThemeToggle.tsx       # Theme switcher
```

## 🎨 Design System

### Neumorphic Design

- **Soft UI**: Subtle shadows and highlights
- **Color Palette**: Light/dark theme support
- **Typography**: Clear hierarchy
- **Spacing**: 8px grid system

### Key Components

#### Button Component

```typescript
// Wireframe button
<button className="btn-wireframe">
  Get Started
</button>

// Primary button
<button className="btn-wireframe btn-wireframe--primary">
  Submit
</button>
```

#### Card Component

```typescript
<Card className="neumorphic-card">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### Modal Component

```typescript
<Modal isOpen={isModalOpen} onClose={handleClose}>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</Modal>
```

## 🎨 Styling

### CSS Architecture (ITCSS)

```
src/css/
├── settings/                 # Variables and settings
├── generic/                  # Reset and base styles
├── elements/                 # HTML elements
├── objects/                  # Layout objects
├── components/               # Component styles
└── utilities/                # Utility classes
```

### Key Style Files

- `_buttons.scss` - Button components
- `_forms.scss` - Form elements
- `_modal.scss` - Modal styling
- `_landing.scss` - Landing page
- `_dashboard.scss` - Dashboard styles

## 🔧 Usage Examples

### Theme Toggle

```typescript
import { ThemeToggle } from '../components/ui/ThemeToggle';

<ThemeToggle />
```

### Language Toggle

```typescript
import { LanguageToggle } from '../components/ui/LanguageToggle';

<LanguageToggle />
```

### Toast Notifications

```typescript
import { Toast } from '../components/common/Toast';

<Toast
  type="success"
  message="Operation completed!"
  isVisible={true}
/>
```

## 🌐 Internationalization

All components support i18n:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<button>{t('button_label')}</button>
```

## 🧪 Testing

Components include unit tests:

```typescript
// Button.test.tsx
test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```
