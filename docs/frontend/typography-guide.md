# Typography Guide - Professional Number Styling

## Font Number yang Profesional

Project ini menggunakan sistem font yang dioptimalkan untuk angka yang terlihat profesional dan konsisten.

### Font Stack untuk Angka

```scss
--font-family-numbers:
  "Inter", "SF Pro Display", "Segoe UI", system-ui, sans-serif;
```

### Font Features untuk Angka

```scss
--font-feature-numeric: "tnum" 1, "onum" 1, "lnum" 1;
--font-variant-numeric: tabular-nums;
```

### Utility Classes

#### `.numeric-display`

Class dasar untuk angka yang profesional:

```scss
.numeric-display {
  font-family: var(--font-family-numbers);
  font-variant-numeric: var(--font-variant-numeric);
  font-feature-settings: var(--font-feature-numeric);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
}
```

#### Variasi Ukuran

- `.numeric-display--bold` - Font weight bold
- `.numeric-display--large` - Ukuran besar (text-2xl)
- `.numeric-display--xl` - Ukuran extra large (text-3xl)
- `.numeric-display--mono` - Menggunakan font monospace

#### Font Variant Numeric

- `.tabular-nums` - Angka dengan lebar yang sama (untuk tabel/data)
- `.oldstyle-nums` - Angka dengan baseline yang berbeda (untuk display)
- `.lining-nums` - Angka dengan baseline yang sama (untuk UI)

### Penggunaan Otomatis

Angka akan otomatis menggunakan styling profesional jika menggunakan class berikut:

- `.numeric`, `.number`
- `.stat-value`, `.stat-number`
- `.price`, `.amount`, `.percentage`
- Class yang mengandung `number`, `stat`, atau `metric`

### Contoh Penggunaan

```html
<!-- Angka statistik -->
<div class="stat-value">1,234</div>

<!-- Angka dengan utility class -->
<span class="numeric-display">567</span>
<span class="numeric-display--large">890</span>

<!-- Angka untuk tabel -->
<td class="tabular-nums">1,234.56</td>

<!-- Angka untuk display -->
<h1 class="numeric-display--xl">404</h1>
```

### Keuntungan

1. **Konsistensi** - Semua angka menggunakan font yang sama
2. **Profesional** - Font Inter memberikan tampilan yang clean
3. **Tabular Numbers** - Angka dengan lebar yang sama untuk alignment yang baik
4. **Optimized** - Font features yang tepat untuk angka
5. **Responsive** - Letter spacing yang disesuaikan untuk berbagai ukuran
