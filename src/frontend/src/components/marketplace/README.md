# Marketplace Components

Komponen marketplace yang di-redesign dengan referensi OpenSea, mempertahankan design wireframe 1px.

## Komponen

### MarketplaceHeader
Header utama marketplace dengan search bar, navigation, dan wallet connection.

```tsx
import { MarketplaceHeader } from './MarketplaceHeader';

<MarketplaceHeader
  onSearch={(query) => console.log(query)}
  onConnectWallet={() => console.log('Connect wallet')}
/>
```

### CategoryFilter
Filter kategori dan sorting options untuk marketplace.

```tsx
import { CategoryFilter } from './CategoryFilter';

<CategoryFilter
  selectedCategory="all"
  onCategoryChange={(category) => setCategory(category)}
  selectedTimeframe="1d"
  onTimeframeChange={(timeframe) => setTimeframe(timeframe)}
  selectedView="grid"
  onViewChange={(view) => setView(view)}
/>
```

### HeroBanner
Banner hero dengan featured collection dan statistik.

```tsx
import { HeroBanner } from './HeroBanner';

<HeroBanner
  featuredCollection={{
    id: 'collection-id',
    name: 'Collection Name',
    creator: 'Creator Name',
    image: '/path/to/image.jpg',
    floorPrice: '1.5',
    currency: 'ETH',
    items: 1000,
    totalVolume: '500K',
    listedPercentage: '2%',
    previewImages: ['/img1.jpg', '/img2.jpg', '/img3.jpg']
  }}
/>
```

### FeaturedCollections
Grid koleksi unggulan dengan informasi harga dan perubahan.

```tsx
import { FeaturedCollections } from './FeaturedCollections';

<FeaturedCollections
  collections={[
    {
      id: 'collection-1',
      name: 'Collection Name',
      image: '/path/to/image.jpg',
      floorPrice: '1.5',
      currency: 'ETH',
      change: 5.2,
      verified: true
    }
  ]}
  title="Featured Collections"
  subtitle="This week's curated collections."
/>
```

### CollectionList
Sidebar daftar koleksi teratas dengan real-time data.

```tsx
import { CollectionList } from './CollectionList';

<CollectionList
  collections={[
    {
      id: 'collection-1',
      name: 'Collection Name',
      image: '/path/to/image.jpg',
      floorPrice: '1.5',
      currency: 'ETH',
      change: 5.2,
      verified: true
    }
  ]}
  title="TOP COLLECTIONS"
/>
```

### Sidebar
Navigation sidebar dengan menu utama marketplace.

```tsx
import { Sidebar } from './Sidebar';

<Sidebar
  activeSection="explore"
  onSectionChange={(section) => setActiveSection(section)}
/>
```

## Props Interfaces

### MarketplaceHeaderProps
```tsx
interface MarketplaceHeaderProps {
  onSearch: (query: string) => void;
  onConnectWallet: () => void;
}
```

### CategoryFilterProps
```tsx
interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}
```

### HeroBannerProps
```tsx
interface HeroBannerProps {
  featuredCollection: {
    id: string;
    name: string;
    creator: string;
    image: string;
    floorPrice: string;
    currency: string;
    items: number;
    totalVolume: string;
    listedPercentage: string;
    previewImages: string[];
  };
}
```

### FeaturedCollectionsProps
```tsx
interface FeaturedCollectionsProps {
  collections: Collection[];
  title: string;
  subtitle: string;
}

interface Collection {
  id: string;
  name: string;
  image: string;
  floorPrice: string;
  currency: string;
  change: number;
  verified: boolean;
}
```

### CollectionListProps
```tsx
interface CollectionListProps {
  collections: Collection[];
  title: string;
}
```

### SidebarProps
```tsx
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
```

## Styling

Semua komponen menggunakan CSS classes yang terdefinisi di `_marketplace.scss`:

- `.marketplace-header` - Header styling
- `.category-filter` - Filter styling
- `.hero-banner` - Hero banner styling
- `.featured-collections` - Collections grid styling
- `.collection-list` - Sidebar list styling
- `.marketplace-sidebar` - Sidebar navigation styling

## Responsive Design

Semua komponen responsive dengan breakpoints:
- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px

## Internationalization

Komponen menggunakan `useTranslation` hook untuk i18n:

```tsx
const { t } = useTranslation('marketplace');
```

Translation keys tersedia di:
- `src/frontend/src/locales/id/marketplace.json`
- `src/frontend/src/locales/en/marketplace.json`

## Usage Example

```tsx
import React, { useState } from 'react';
import {
  MarketplaceHeader,
  CategoryFilter,
  HeroBanner,
  FeaturedCollections,
  CollectionList,
  Sidebar
} from './marketplace';

const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [activeSection, setActiveSection] = useState('explore');

  return (
    <div className="marketplace-page">
      <MarketplaceHeader
        onSearch={(query) => console.log(query)}
        onConnectWallet={() => console.log('Connect wallet')}
      />
      
      <div className="marketplace-layout">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="marketplace-main">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTimeframe="1d"
            onTimeframeChange={() => {}}
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
          
          <HeroBanner featuredCollection={featuredCollection} />
          <FeaturedCollections collections={collections} />
        </main>
        
        <CollectionList collections={topCollections} />
      </div>
    </div>
  );
};
``` 