# Icon Size Standards

## Overview

Dokumen ini menjelaskan standar ukuran icon yang konsisten di seluruh aplikasi IC-Vibe.

## Icon Size Hierarchy

### 1. Extra Small (10px) - `--icon-xs`

- **Penggunaan**: Meta info, timestamps, small indicators
- **Contoh**: Clock icon di photo meta, status indicators
- **CSS Class**: `.icon-xs`

### 2. Small (12px) - `--icon-sm`

- **Penggunaan**: Button icons, overlay actions
- **Contoh**: Download, trash icons di photo overlay
- **CSS Class**: `.icon-sm`

### 3. Medium (14px) - `--icon-md`

- **Penggunaan**: File items, action buttons
- **Contoh**: File icons di upload list, action buttons
- **CSS Class**: `.icon-md`

### 4. Large (16px) - `--icon-lg`

- **Penggunaan**: Navigation, upload areas, main actions
- **Contoh**: Camera icon di upload zone, navigation icons
- **CSS Class**: `.icon-lg`

### 5. Extra Large (20px) - `--icon-xl`

- **Penggunaan**: Section headers, prominent features
- **Contoh**: Section icons, feature highlights
- **CSS Class**: `.icon-xl`

### 6. 2X Large (24px) - `--icon-2xl`

- **Penggunaan**: Large feature icons
- **Contoh**: Dashboard stat icons, main features
- **CSS Class**: `.icon-2xl`

### 7. 3X Large (32px) - `--icon-3xl`

- **Penggunaan**: Hero icons, landing page features
- **Contoh**: Landing page feature icons
- **CSS Class**: `.icon-3xl`

### 8. 4X Large (48px) - `--icon-4xl`

- **Penggunaan**: Extra large icons, hero sections
- **Contoh**: Hero section icons
- **CSS Class**: `.icon-4xl`

## Implementation Guidelines

### React Component Usage

```typescript
// ✅ Correct - Use consistent sizes
<Camera size={16} />        // Upload areas
<Download size={12} />      // Button overlays
<Clock size={10} />         // Meta info
<Image size={14} />         // File items
```

### CSS Implementation

```scss
// ✅ Correct - Use CSS variables
.icon-upload {
  svg {
    width: var(--icon-lg);
    height: var(--icon-lg);
  }
}

.icon-overlay {
  svg {
    width: var(--icon-sm);
    height: var(--icon-sm);
  }
}
```

### Common Patterns

#### Upload Areas

- Camera icon: 16px
- Upload button icon: 14px
- File item icons: 14px

#### Photo Overlays

- Download icon: 12px
- Delete icon: 12px
- Button size: 32px (desktop), 28px (mobile)
- Shape: Circular with elegant hover effects
- Animation: Smooth scale and fade transitions
- Spacing: 16px gap between buttons (desktop), 12px (mobile)

#### Navigation

- Back button: 16px
- Menu icons: 16px
- Action buttons: 14px

#### Meta Information

- Timestamp icons: 10px
- Status indicators: 10px
- Small info icons: 10px

## Troubleshooting

### Icon Too Large

- Cek apakah menggunakan `size` prop yang benar
- Pastikan CSS tidak override ukuran
- Gunakan `!important` jika diperlukan

### Icon Too Small

- Pastikan ukuran minimum sesuai standar
- Cek responsive breakpoints
- Verifikasi CSS variables

### Inconsistent Sizing

- Gunakan CSS variables untuk konsistensi
- Implementasikan CSS classes yang standar
- Test di berbagai screen sizes

## Photo Action Buttons Design

### Elegant Circular Buttons

Photo action buttons menggunakan desain yang elegant dengan:

#### Visual Design

- **Shape**: Perfect circle dengan border-radius: 50%
- **Size**: 32px desktop, 28px mobile
- **Background**: Clean white surface dengan subtle shadow
- **Animation**: Smooth cubic-bezier transitions
- **Hover Effects**: Scale transform + color change + enhanced shadow
- **Spacing**: 16px gap between buttons (desktop), 12px (mobile)

#### Button Types

```scss
.photo-action-btn--download {
  &:hover {
    background: var(--color-accent);
  }
}

.photo-action-btn--delete {
  &:hover {
    background: var(--color-error);
  }
}
```

#### Animation Features

- **Overlay**: Backdrop blur + fade in/out
- **Buttons**: Staggered entrance animation
- **Hover**: Scale + glow effect + icon color change
- **Active**: Quick scale down feedback

#### Accessibility Features

- **Focus States**: Clear outline dengan color-coded feedback
- **Touch Targets**: Minimum 40px untuk easy interaction
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Title attributes untuk context

#### Implementation Example

```typescript
<div className="photo-overlay">
  <button
    className="photo-action-btn photo-action-btn--download"
    onClick={() => window.open(photo.url, "_blank")}
    title={t("session.download_photo")}
  >
    <Download size={12} />
  </button>
  <button
    className="photo-action-btn photo-action-btn--delete"
    onClick={() => handleDeletePhoto(photo.id)}
    title={t("session.delete_photo")}
  >
    <Trash2 size={12} />
  </button>
</div>
```

## Best Practices

1. **Konsistensi**: Selalu gunakan ukuran yang sama untuk fungsi yang sama
2. **Hierarchy**: Gunakan ukuran yang sesuai dengan importance
3. **Accessibility**: Pastikan touch targets minimal 44px
4. **Responsive**: Test di berbagai device sizes
5. **Documentation**: Update dokumentasi saat ada perubahan

#### Button Icons

- Primary button: White icon on dark background
- Secondary button: Dark icon, changes to primary color on hover
- Outline button: Primary color icon, changes to white on hover
- Ghost button: Secondary color icon
- Status buttons: White icon (success, error, warning, info)

## Button Icon Colors

### Color Guidelines

Button icons mengikuti warna text button untuk konsistensi visual:

#### Primary Buttons

```scss
.btn--primary {
  background: var(--color-primary-text);
  color: var(--color-surface);

  svg {
    color: var(--color-surface); // White icon
  }
}
```

#### Secondary Buttons

```scss
.btn--secondary {
  background: transparent;
  color: var(--color-text-primary);

  svg {
    color: var(--color-text-primary); // Dark icon
  }

  &:hover {
    color: var(--color-primary-text);

    svg {
      color: var(--color-primary-text); // Primary color on hover
    }
  }
}
```

#### Outline Buttons

```scss
.btn--outline {
  background: transparent;
  color: var(--color-primary-text);

  svg {
    color: var(--color-primary-text); // Primary color icon
  }

  &:hover {
    background: var(--color-primary-text);
    color: var(--color-surface);

    svg {
      color: var(--color-surface); // White icon on hover
    }
  }
}
```

#### Status Buttons

```scss
.btn--success,
.btn--error,
.btn--warning,
.btn--info {
  color: var(--color-white);

  svg {
    color: var(--color-white); // White icon
  }
}
```

### Implementation Best Practices

1. **Consistency**: Icon selalu mengikuti warna text button
2. **Hover States**: Icon berubah warna sesuai dengan text pada hover
3. **Accessibility**: Kontras yang cukup antara icon dan background
4. **Transitions**: Smooth color transitions untuk semua states

## Troubleshooting
