import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarketplaceHeader } from '../../components/marketplace/MarketplaceHeader';
import { CategoryFilter } from '../../components/marketplace/CategoryFilter';
import { HeroBanner } from '../../components/marketplace/HeroBanner';
import { FeaturedCollections } from '../../components/marketplace/FeaturedCollections';
import { CollectionList } from '../../components/marketplace/CollectionList';
import { Sidebar } from '../../components/marketplace/Sidebar';

export const MarketplaceHomePage: React.FC = () => {
  const { t } = useTranslation('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [activeSection, setActiveSection] = useState('explore');

  // Mock data untuk featured collection
  const featuredCollection = {
    id: 'off-the-grid',
    name: 'Off The Grid',
    creator: 'Gunz',
    image: '/api/placeholder/800/400',
    floorPrice: '11.00',
    currency: 'GUN',
    items: 6821231,
    totalVolume: '1.6M',
    listedPercentage: '< 0.1%',
    previewImages: [
      '/api/placeholder/100/100',
      '/api/placeholder/100/100',
      '/api/placeholder/100/100'
    ]
  };

  // Mock data untuk featured collections
  const featuredCollections = [
    {
      id: 'moonbirds',
      name: 'Moonbirds',
      image: '/api/placeholder/300/200',
      floorPrice: '1.92',
      currency: 'ETH',
      change: 17.1,
      verified: true
    },
    {
      id: 'off-the-grid',
      name: 'Off The Grid',
      image: '/api/placeholder/300/200',
      floorPrice: '11.00',
      currency: 'GUN',
      change: -75.6,
      verified: true
    },
    {
      id: 'on-chain-all-stars',
      name: 'On-Chain All-Stars',
      image: '/api/placeholder/300/200',
      floorPrice: '0.0035',
      currency: 'ETH',
      change: -18.7,
      verified: false
    },
    {
      id: 'overture',
      name: 'Overture by Mitchell F. Chan',
      image: '/api/placeholder/300/200',
      floorPrice: '0.32',
      currency: 'ETH',
      change: 0,
      verified: false
    }
  ];

  // Mock data untuk collection list
  const topCollections = [
    {
      id: 'pudgy-penguins',
      name: 'Pudgy Penguins',
      image: '/api/placeholder/40/40',
      floorPrice: '15.96',
      currency: 'ETH',
      change: 1.3,
      verified: true
    },
    {
      id: 'cryptopunks',
      name: 'CryptoPunks',
      image: '/api/placeholder/40/40',
      floorPrice: '50.99',
      currency: 'ETH',
      change: 0,
      verified: true
    },
    {
      id: 'bored-ape-yacht-club',
      name: 'Bored Ape Yacht Club',
      image: '/api/placeholder/40/40',
      floorPrice: '12.67',
      currency: 'ETH',
      change: 4.6,
      verified: true
    },
    {
      id: 'milady-maker',
      name: 'Milady Maker',
      image: '/api/placeholder/40/40',
      floorPrice: '3.20',
      currency: 'ETH',
      change: 5.8,
      verified: false
    },
    {
      id: 'moonbirds',
      name: 'Moonbirds',
      image: '/api/placeholder/40/40',
      floorPrice: '1.92',
      currency: 'ETH',
      change: 17.1,
      verified: true
    },
    {
      id: 'rektguy',
      name: 'rektguy',
      image: '/api/placeholder/40/40',
      floorPrice: '1.35',
      currency: 'ETH',
      change: 18.5,
      verified: false
    },
    {
      id: 'lil-pudgys',
      name: 'Lil Pudgys',
      image: '/api/placeholder/40/40',
      floorPrice: '1.73',
      currency: 'ETH',
      change: 4.3,
      verified: false
    },
    {
      id: 'dx-terminal',
      name: 'DX Terminal',
      image: '/api/placeholder/40/40',
      floorPrice: '< 0.01',
      currency: 'ETH',
      change: 0.9,
      verified: false
    },
    {
      id: 'mutant-ape-yacht-club',
      name: 'Mutant Ape Yacht Club',
      image: '/api/placeholder/40/40',
      floorPrice: '1.89',
      currency: 'ETH',
      change: 4.6,
      verified: true
    },
    {
      id: 'azuki',
      name: 'Azuki',
      image: '/api/placeholder/40/40',
      floorPrice: '2.08',
      currency: 'ETH',
      change: 6.2,
      verified: true
    },
    {
      id: 'fidenza',
      name: 'Fidenza by Tyler Hobbs',
      image: '/api/placeholder/40/40',
      floorPrice: '34.89',
      currency: 'ETH',
      change: 2.6,
      verified: false
    },
    {
      id: 'doodles',
      name: 'Doodles',
      image: '/api/placeholder/40/40',
      floorPrice: '1.04',
      currency: 'ETH',
      change: 6.3,
      verified: true
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleConnectWallet = () => {
    console.log('Connect wallet clicked');
    // Implement wallet connection
  };

  return (
    <div className="marketplace-page">
      {/* Header */}
      <MarketplaceHeader
        onSearch={handleSearch}
        onConnectWallet={handleConnectWallet}
      />

      <div className="marketplace-layout">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="marketplace-main">
          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />

          {/* Hero Banner */}
          <HeroBanner featuredCollection={featuredCollection} />

          {/* Featured Collections */}
          <FeaturedCollections
            collections={featuredCollections}
            title={t('featuredCollections.title')}
            subtitle={t('featuredCollections.subtitle')}
          />

          {/* Featured Drops */}
          <FeaturedCollections
            collections={[]}
            title={t('featuredDrops.title')}
            subtitle={t('featuredDrops.subtitle')}
          />
        </main>

        {/* Collection List Sidebar */}
        <CollectionList
          collections={topCollections}
          title={t('topCollections')}
        />
      </div>
    </div>
  );
}; 