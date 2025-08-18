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
- Button size: 28px

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

## Best Practices

1. **Konsistensi**: Selalu gunakan ukuran yang sama untuk fungsi yang sama
2. **Hierarchy**: Gunakan ukuran yang sesuai dengan importance
3. **Accessibility**: Pastikan touch targets minimal 44px
4. **Responsive**: Test di berbagai device sizes
5. **Documentation**: Update dokumentasi saat ada perubahan
