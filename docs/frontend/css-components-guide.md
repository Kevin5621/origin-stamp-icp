# Panduan Komponen CSS

## Overview

Panduan ini menjelaskan detail implementasi setiap komponen CSS dalam framework ITCSS, termasuk penggunaan, variasi, dan best practices.

## Komponen Dashboard

### Stat Cards

**File:** `components/_dashboard.scss`

Stat cards menampilkan metrik penting dengan desain wireframe dan hover effects.

```scss
.stat-card {
  @extend .wireframe-card !optional;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
  }
}
```

**Variasi:**

- `.stat-primary` - Info color scheme
- `.stat-secondary` - Neutral color scheme
- `.stat-success` - Success color scheme
- `.stat-warning` - Warning color scheme
- `.stat-info` - Information color scheme

**Penggunaan:**

```html
<div class="stat-card stat-primary">
  <div class="stat-icon-wrapper">
    <svg><!-- icon --></svg>
  </div>
  <div class="stat-content">
    <div class="stat-value">1,234</div>
    <div class="stat-label">Total Projects</div>
  </div>
</div>
```

### Quick Action Cards

**File:** `components/_dashboard.scss`

Cards untuk aksi cepat dengan icon dan deskripsi.

```scss
.quick-action-card {
  @extend .wireframe-card !optional;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
  }
}
```

**Variasi:**

- `.quick-action-primary` - Primary action styling
- `.quick-action-secondary` - Secondary action styling

### Project Cards

**File:** `components/_dashboard.scss`

Cards untuk menampilkan project dengan progress dan metadata.

```scss
.project-card {
  @extend .wireframe-card !optional;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
  }
}
```

## Komponen Analytics

### Chart Cards

**File:** `components/_analytics.scss`

Container untuk chart dan data visualization.

```scss
.chart-card {
  @extend .wireframe-card !optional;
  padding: 2rem;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
  }
}
```

### Activity Cards

**File:** `components/_analytics.scss`

Cards untuk menampilkan recent activity feeds.

```scss
.activity-card {
  @extend .wireframe-card !optional;
  padding: 2rem;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
  }
}
```

### Data Points

**File:** `components/_analytics.scss`

Individual data points untuk chart legends.

```scss
.data-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--color-primary-bg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  min-width: 80px;
}
```

## Komponen Certificates

### Certificate Cards

**File:** `components/_certificates.scss`

Cards untuk menampilkan certificate information.

```scss
.certificate-card {
  @extend .wireframe-card !optional;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
  }
}
```

### Certificate Details

**File:** `components/_certificates.scss`

Container untuk detail certificate information.

```scss
.certificate-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--color-primary-bg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
```

### Status Badges

**File:** `components/_certificates.scss`

Badges untuk menampilkan status certificate.

```scss
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-surface);
  background-color: var(--color-success);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Komponen Session

### Art Type Cards

**File:** `components/_session.scss`

Cards untuk pemilihan jenis seni.

```scss
.art-type-card {
  @extend .wireframe-card !optional;
  cursor: pointer;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-4px);
  }
}
```

### Setup Cards

**File:** `components/_session.scss`

Cards untuk setup dan konfigurasi session.

```scss
.setup-card {
  @extend .wireframe-card !optional;
  padding: 2rem;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
  }
}
```

### Plugin Items

**File:** `components/_session.scss`

Items untuk plugin management.

```scss
.plugin-item {
  @extend .wireframe-card !optional;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary-text);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
  }
}
```

### Upload Area

**File:** `components/_session.scss`

Area untuk upload file dengan drag & drop.

```scss
.upload-area {
  @extend .wireframe-card !optional;
  border: 2px dashed var(--color-border);
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary-text);
    background-color: var(--color-primary-bg);
  }

  &.drag-over {
    border-color: var(--color-info);
    background-color: rgba(var(--color-info-rgb), 0.1);
  }
}
```

## Komponen Buttons

### Wireframe Buttons

**File:** `components/_buttons.scss`

Button dengan desain wireframe yang konsisten.

```scss
.btn-wireframe {
  background-color: transparent;
  color: var(--color-on-surface);
  border: 2px solid var(--color-primary-text);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: var(--font-weight-bold);
  font-size: 0.875rem;
  letter-spacing: var(--letter-spacing-tight);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  text-transform: uppercase;
  font-family: var(--font-family-mono);

  &:hover {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
    border-color: var(--color-primary-text);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}
```

**Variasi Ukuran:**

- `.btn-wireframe--small` - Padding kecil
- `.btn-wireframe--large` - Padding besar

**Variasi Warna:**

- `.btn-wireframe--primary` - Primary color
- `.btn-wireframe--secondary` - Secondary color
- `.btn-wireframe--success` - Success color
- `.btn-wireframe--error` - Error color
- `.btn-wireframe--warning` - Warning color

### Circular Buttons

**File:** `components/_buttons.scss`

Button berbentuk lingkaran untuk toggle dan actions.

```scss
.theme-toggle,
.language-toggle,
.btn-login-circular {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  box-shadow: var(--shadow-neumorphic-sm);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: var(--theme-transition);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
}
```

## Komponen Navigation

### Navigation Menus

**File:** `components/_navigation.scss`

Menu navigasi dengan wireframe styling.

```scss
.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-item {
  @extend .wireframe-button !optional;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;

  &:hover {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
  }

  &.active {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
  }
}
```

### Filter Tabs

**File:** `components/_navigation.scss`

Tabs untuk filtering dan sorting.

```scss
.filter-tabs {
  display: flex;
  gap: 0;
  border: 2px solid var(--color-primary-text);
  border-radius: 0;
  overflow: hidden;
}

.filter-tab {
  background: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  color: var(--color-primary-text);
  font-family: var(--font-family-mono);
  text-transform: uppercase;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
  }

  &.active {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
  }
}
```

## Komponen Forms

### Form Inputs

**File:** `components/_forms.scss`

Input fields dengan wireframe styling.

```scss
.wireframe-input {
  background-color: transparent;
  border: 2px solid var(--color-primary-text);
  color: var(--color-primary-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  border-radius: 0;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-info);
    box-shadow: 0 0 0 3px rgba(var(--color-info-rgb), 0.2);
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.6;
  }
}
```

### Form Groups

**File:** `components/_forms.scss`

Container untuk grouping form elements.

```scss
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Komponen Modal

### Modal Overlay

**File:** `components/_modal.scss`

Overlay untuk modal dialogs.

```scss
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
```

### Modal Content

**File:** `components/_modal.scss`

Content container untuk modal.

```scss
.modal-content {
  @extend .wireframe-card !optional;
  position: relative;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;

  &:hover {
    background-color: var(--color-primary-text);
    color: var(--color-surface);
  }
}
```

## Komponen Toast

### Toast Notifications

**File:** `components/_toast.scss`

Notification system dengan berbagai variants.

```scss
.toast {
  @extend .wireframe-card !optional;
  position: fixed;
  top: 2rem;
  right: 2rem;
  max-width: 400px;
  padding: 1rem 1.5rem;
  z-index: 1000;
  animation: slideIn 0.3s ease;

  &.toast-success {
    border-color: var(--color-success);
    background-color: rgba(var(--color-success-rgb), 0.1);
  }

  &.toast-error {
    border-color: var(--color-error);
    background-color: rgba(var(--color-error-rgb), 0.1);
  }

  &.toast-warning {
    border-color: var(--color-warning);
    background-color: rgba(var(--color-warning-rgb), 0.1);
  }
}
```

## Komponen Surface

### Surface Containers

**File:** `components/_surface.scss`

Base surface styling untuk containers.

```scss
.surface {
  background-color: var(--color-surface);
  border-radius: 1.5rem;
  box-shadow:
    6px 6px 12px var(--color-shadow-dark),
    -6px -6px 12px var(--color-shadow-light);
  padding: 2rem;
}

.surface-elevated {
  @extend .surface;
  box-shadow:
    12px 12px 24px var(--color-shadow-dark),
    -12px -12px 24px var(--color-shadow-light);
}
```



## Best Practices

### 1. Hover States

Semua komponen mengikuti pattern hover yang konsisten:

```scss
&:hover {
  background-color: var(--color-surface);
  color: var(--color-primary-text);
  border-color: var(--color-primary-text);
  transform: translateY(-2px);
  box-shadow: /* enhanced shadow */;
}
```

### 2. Focus States

Accessibility focus states:

```scss
&:focus-visible {
  outline: 2px solid var(--color-info);
  outline-offset: 2px;
}
```

### 3. Transitions

Smooth transitions untuk semua interactive elements:

```scss
transition: all 0.3s ease;
```

### 4. Responsive Design

Mobile-first approach dengan breakpoints:

```scss
@media (max-width: 768px) {
  // Mobile styles
}

@media (max-width: 480px) {
  // Small mobile styles
}
```

## Customization

### 1. Theme Variables

Modify colors in `settings/_settings.scss`:

```scss
:root {
  --color-primary-text: #your-color;
  --color-surface: #your-surface-color;
}
```

### 2. Component Variants

Add new variants by extending existing components:

```scss
.custom-variant {
  @extend .base-component;
  // Custom styles
}
```

### 3. Responsive Adjustments

Override responsive behavior:

```scss
@media (max-width: 768px) {
  .component {
    // Custom mobile styles
  }
}
```

## Performance Tips

1. **Use CSS Custom Properties** for dynamic theming
2. **Optimize selectors** for better performance
3. **Use transform** instead of position changes for animations
4. **Minimize repaints** with efficient hover states
5. **Use will-change** sparingly for complex animations
