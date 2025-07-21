# Struktur ITCSS CSS Framework

## Overview

Framework CSS ini mengikuti metodologi **ITCSS (Inverted Triangle CSS)** yang mengorganisir CSS berdasarkan spesifisitas dan scope. Struktur ini memastikan maintainability, scalability, dan konsistensi dalam pengembangan frontend.

## Struktur Folder

```
src/frontend/src/css/
├── main.scss                 # Entry point utama
├── settings/                 # Layer 1: Settings
│   └── _settings.scss       # Variables, colors, fonts, breakpoints
├── tools/                    # Layer 2: Tools
│   └── _mixins.scss         # Mixins, functions, helpers
├── generic/                  # Layer 3: Generic
│   └── _base.scss           # Reset, normalize, base styles
├── elements/                 # Layer 4: Elements
│   ├── _forms.scss          # Form elements styling
│   └── _canvas.scss         # Canvas and drawing elements
├── objects/                  # Layer 5: Objects
│   ├── _layout.scss         # Layout patterns, grid systems
│   └── _bento.scss          # Bento grid layouts
├── components/               # Layer 6: Components
│   ├── _analytics.scss      # Analytics page components
│   ├── _buttons.scss        # Button components
│   ├── _certificates.scss   # Certificates page components
│   ├── _dashboard.scss      # Dashboard components
│   ├── _forms.scss          # Form components
│   ├── _header.scss         # Header components
│   ├── _landing.scss        # Landing page components
│   ├── _login-form.scss     # Login form components
│   ├── _login-page.scss     # Login page components
│   ├── _login.scss          # Login components
│   ├── _modal.scss          # Modal components
│   ├── _navigation.scss     # Navigation components
│   ├── _profile.scss        # Profile components
│   ├── _session.scss        # Session components
│   ├── _surface.scss        # Surface components
│   └── _toast.scss          # Toast notification components
└── utilities/                # Layer 7: Utilities
    ├── _utilities.scss      # Utility classes
    ├── _responsive.scss     # Responsive utilities
    ├── _performance.scss    # Performance utilities
    └── _legacy.scss         # Legacy support utilities
```

## Layer ITCSS

### Layer 1: Settings

**File:** `settings/_settings.scss`

Layer ini berisi semua variabel dan konfigurasi global:

- **CSS Custom Properties**: Colors, spacing, typography
- **Theme Variables**: Light/dark theme configurations
- **Breakpoints**: Responsive design breakpoints
- **Font Settings**: Font families, weights, sizes
- **Animation Settings**: Transitions, durations, easing

```scss
// Contoh struktur settings
:root {
  // Color System
  --color-primary-text: #1a1a1a;
  --color-surface: #ffffff;
  --color-primary-bg: #f8f9fa;

  // Spacing System
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  // Typography
  --font-family-mono: "Courier New", monospace;
  --font-weight-bold: 700;
}
```

### Layer 2: Tools

**File:** `tools/_mixins.scss`

Layer ini berisi mixins, functions, dan helper utilities:

- **Layout Mixins**: Grid, flexbox helpers
- **Typography Mixins**: Font scaling, line height
- **Animation Mixins**: Transitions, keyframes
- **Media Query Mixins**: Responsive breakpoints
- **Theme Mixins**: Dark/light theme switching

```scss
// Contoh mixins
@mixin responsive($breakpoint) {
  @if $breakpoint == tablet {
    @media (max-width: 768px) {
      @content;
    }
  }
}

@mixin wireframe-card {
  background-color: var(--color-surface);
  border: 2px solid var(--color-primary-text);
  border-radius: 0;
  padding: 1rem;
}
```

### Layer 3: Generic

**File:** `generic/_base.scss`

Layer ini berisi reset, normalize, dan base styles:

- **CSS Reset**: Reset browser defaults
- **Base Typography**: Default font settings
- **Base Layout**: Default box-sizing, margins
- **Accessibility**: Focus states, screen reader support

```scss
// Contoh base styles
* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  line-height: 1.6;
  color: var(--color-primary-text);
}
```

### Layer 4: Elements

**Files:** `elements/_forms.scss`, `elements/_canvas.scss`

Layer ini berisi styling untuk HTML elements:

- **Form Elements**: Input, select, textarea styling
- **Canvas Elements**: Drawing canvas, 3D elements
- **Typography Elements**: Headings, paragraphs, lists
- **Interactive Elements**: Links, buttons (basic)

```scss
// Contoh element styling
input[type="text"] {
  border: 2px solid var(--color-primary-text);
  border-radius: 0;
  padding: 0.5rem;
  font-family: var(--font-family-mono);
}
```

### Layer 5: Objects

**Files:** `objects/_layout.scss`, `objects/_bento.scss`

Layer ini berisi layout patterns dan structural components:

- **Layout Objects**: Grid systems, containers
- **Bento Grid**: Modern card-based layouts
- **Navigation Objects**: Menu structures

```scss
// Contoh object styling
.dashboard-layout {
  display: grid;
  grid-template-areas: "header header" "sidebar main";
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}
```

### Layer 6: Components

**Files:** `components/_*.scss`

Layer ini berisi reusable UI components:

- **Page Components**: Dashboard, Analytics, Certificates
- **UI Components**: Buttons, modals, toasts
- **Form Components**: Login forms, search forms
- **Navigation Components**: Headers, navigation menus

#### Komponen Utama:

##### `_dashboard.scss`

- Dashboard layout dan struktur
- Stat cards dengan hover effects
- Quick action cards
- Project cards dan lists
- Search dan filter components

##### `_analytics.scss`

- Analytics page layout
- Chart cards dan data visualization
- Activity feeds
- Distribution charts
- Stat overview cards

##### `_certificates.scss`

- Certificate cards dan grid
- Certificate details dan metadata
- Status badges
- Action buttons
- Modal components

##### `_session.scss`

- Session management components
- Art type selection cards
- Plugin management
- Upload areas
- Session status indicators

##### `_buttons.scss`

- Wireframe button variants
- Button sizes (small, large)
- Color variants (primary, secondary, success, error)
- Icon buttons
- Button groups

##### `_navigation.scss`

- Navigation menus
- Breadcrumbs
- Filter tabs
- Pagination
- Mobile navigation

##### `_forms.scss`

- Form layouts
- Input styling
- Validation states
- Form groups
- Search inputs

##### `_modal.scss`

- Modal overlays
- Modal content containers
- Modal headers dan actions
- Responsive modal behavior

##### `_toast.scss`

- Toast notifications
- Toast variants (success, error, warning)
- Toast positioning
- Animation effects

##### `_header.scss`

- App headers
- Header navigation
- User profile sections
- Theme toggles

##### `_landing.scss`

- Landing page components
- Hero sections
- Feature cards
- Call-to-action buttons

##### `_login.scss` & `_login-form.scss` & `_login-page.scss`

- Login page layout
- Authentication forms
- Social login buttons
- Form validation

##### `_profile.scss`

- Profile cards
- Avatar components
- User information display
- Profile editing forms

##### `_surface.scss`

- Surface containers
- Card variations
- Background patterns
- Depth and elevation



### Layer 7: Utilities

**Files:** `utilities/_utilities.scss`, `utilities/_responsive.scss`, `utilities/_performance.scss`, `utilities/_legacy.scss`

Layer ini berisi utility classes dengan spesifisitas tertinggi:

- **Utility Classes**: Spacing, typography, colors
- **Responsive Utilities**: Breakpoint-specific utilities
- **Performance Utilities**: Optimized rendering
- **Legacy Support**: Browser compatibility

```scss
// Contoh utility classes
.text-center {
  text-align: center;
}
.mt-1 {
  margin-top: var(--spacing-sm);
}
.hidden {
  display: none;
}
```

## Prinsip Desain

### 1. Wireframe Design System

- **Sharp Edges**: Border-radius 0 untuk geometric shapes
- **Monospace Fonts**: Courier New untuk technical feel
- **Uppercase Text**: Text-transform uppercase untuk labels
- **Bold Typography**: Font-weight 700 untuk emphasis

### 2. Neumorphic Design

- **Soft Shadows**: Inset dan outset shadows
- **Subtle Depth**: Layered appearance
- **Light/Dark Themes**: Adaptive color schemes
- **Hover Effects**: Interactive feedback

### 3. Semantic Color System

```scss
// Color Hierarchy
--color-primary-text    // Main text color
--color-text-secondary  // Secondary text
--color-text-tertiary   // Tertiary text
--color-surface         // Surface backgrounds
--color-primary-bg      // Page backgrounds
--color-border          // Borders and dividers
```

### 4. Hover State Patterns

```scss
// Consistent hover pattern
&:hover {
  background-color: var(--color-surface);
  color: var(--color-primary-text);
  border-color: var(--color-primary-text);
  transform: translateY(-2px);
  box-shadow: /* enhanced shadow */;
}
```

## Best Practices

### 1. File Organization

- Satu file per component/page
- Konsisten naming convention dengan underscore prefix
- Logical grouping dalam layer ITCSS

### 2. CSS Architecture

- BEM methodology untuk component naming
- CSS Custom Properties untuk theming
- Mobile-first responsive design
- Progressive enhancement

### 3. Performance

- Minimal CSS output
- Efficient selectors
- Optimized animations
- Critical CSS extraction

### 4. Maintainability

- Clear documentation
- Consistent patterns
- Modular structure
- Version control friendly

## Development Workflow

### 1. Adding New Components

1. Identify appropriate layer (usually components)
2. Create new `_component-name.scss` file
3. Import in `main.scss`
4. Follow established patterns
5. Document component usage

### 2. Modifying Existing Components

1. Locate component in appropriate layer
2. Follow existing naming conventions
3. Maintain backward compatibility
4. Update documentation if needed

### 3. Theme Customization

1. Modify variables in `settings/_settings.scss`
2. Use CSS Custom Properties
3. Test light/dark themes
4. Ensure accessibility compliance

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **CSS Features**: Custom Properties, Grid, Flexbox
- **Fallbacks**: Provided for older browsers in `utilities/_legacy.scss`

## Performance Considerations

- **CSS Size**: Optimized for production builds
- **Critical Path**: Critical CSS identified and inlined
- **Animation Performance**: Hardware-accelerated transforms
- **Loading Strategy**: Progressive CSS loading

## Accessibility

- **Color Contrast**: WCAG AA compliant
- **Focus States**: Visible focus indicators
- **Screen Readers**: Semantic HTML support
- **Keyboard Navigation**: Full keyboard accessibility

## Future Enhancements

- **CSS-in-JS Integration**: For dynamic theming
- **Design Token System**: Enhanced variable management
- **Component Library**: Storybook integration
- **Automated Testing**: Visual regression testing
