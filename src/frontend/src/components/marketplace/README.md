# Marketplace Components

Komponen marketplace yang didesain ulang dengan gaya minimalist clean sesuai design system.

## Komponen

### MarketplaceMain

Komponen utama marketplace yang mengintegrasikan semua fitur:

- Header dengan judul dan tombol pencarian
- Search bar untuk pencarian karya seni
- Sidebar dengan filter kategori dan harga
- Grid koleksi karya seni

### MarketplaceHeader

Header marketplace dengan judul dan subtitle yang clean.

### SearchBar

Komponen pencarian dengan input dan tombol search.

### MarketplaceSidebar

Sidebar yang berisi filter kategori dan harga dengan toggle untuk mobile.

### CategoryFilter

Filter kategori dengan daftar kategori yang bisa dipilih.

### PriceFilter

Filter harga dengan input minimum dan maksimum.

### CollectionCard

Card untuk menampilkan karya seni dengan gambar, judul, seniman, dan harga.

### CollectionGrid

Grid layout untuk menampilkan multiple collection cards.

## Gaya

Semua komponen menggunakan:

- Flat design tanpa shadow
- 60-30-10 color rule
- 8pt grid spacing
- Typography hierarchy yang jelas
- Responsive design
- Accessibility compliance

## Penggunaan

```tsx
import { MarketplaceMain } from "../components/marketplace";

export const MarketplacePage = () => {
  return <MarketplaceMain />;
};
```

## Translation

Semua teks menggunakan i18n dengan namespace "marketplace":

- `title`: Judul marketplace
- `subtitle`: Subtitle marketplace
- `search`: Tombol pencarian
- `filters`: Label filter
- `categories`: Kategori karya seni
- `price_format`: Format harga
