import type { NFT, User, Collection } from "../types/marketplace";

// Mock Users
export const mockUsers: User[] = [
  {
    username: "cryptoartist_01",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Digital artist exploring the intersection of technology and creativity. Creating unique pieces with OriginStamp verification.",
    verified: true,
    followers: 12450,
    following: 890,
    totalSales: 156,
    totalVolume: "45,230 ICP",
    socialLinks: {
      twitter: "@cryptoartist_01",
      instagram: "@cryptoartist_01",
      website: "https://cryptoartist01.com",
    },
  },
  {
    username: "digital_creator",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Passionate about creating digital art that tells stories. Each piece is verified with OriginStamp for authenticity.",
    verified: true,
    followers: 8920,
    following: 456,
    totalSales: 89,
    totalVolume: "23,450 ICP",
    socialLinks: {
      twitter: "@digital_creator",
      instagram: "@digital_creator",
    },
  },
  {
    username: "art_collector",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Curating the finest digital art collection. Always looking for unique pieces with proven authenticity.",
    verified: false,
    followers: 5670,
    following: 1234,
    totalSales: 0,
    totalVolume: "0 ICP",
  },
];

// Mock NFTs
export const mockNFTs: NFT[] = [
  {
    id: "nft_001",
    title: "Digital Dreams #1",
    description:
      "A mesmerizing digital artwork exploring the concept of dreams in the digital age. Created using advanced AI tools and traditional artistic techniques.",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    creator: mockUsers[0],
    price: {
      amount: "2.5",
      currency: "ICP",
    },
    status: "for_sale",
    originStamp: {
      certificateId: "cert_001",
      creationProcess: true,
      verified: true,
    },
    likes: 234,
    views: 1567,
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["digital art", "abstract", "dreams", "AI art"],
    collection: "Digital Dreams",
  },
  {
    id: "nft_002",
    title: "Neon Cityscape",
    description:
      "A vibrant cyberpunk cityscape with neon lights and futuristic architecture. Each building tells a story of urban evolution.",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    creator: mockUsers[1],
    price: {
      amount: "1.8",
      currency: "ICP",
    },
    status: "for_sale",
    originStamp: {
      certificateId: "cert_002",
      creationProcess: true,
      verified: true,
    },
    likes: 189,
    views: 892,
    createdAt: "2024-01-20T14:15:00Z",
    tags: ["cyberpunk", "cityscape", "neon", "futuristic"],
    collection: "Urban Futures",
  },
  {
    id: "nft_003",
    title: "Abstract Harmony",
    description:
      "An abstract composition exploring color theory and geometric patterns. Created through a unique process combining digital and traditional techniques.",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    creator: mockUsers[0],
    price: {
      amount: "3.2",
      currency: "ICP",
    },
    status: "sold",
    originStamp: {
      certificateId: "cert_003",
      creationProcess: true,
      verified: true,
    },
    likes: 456,
    views: 2341,
    createdAt: "2024-01-10T09:45:00Z",
    tags: ["abstract", "geometric", "color theory", "modern art"],
    collection: "Abstract Harmony",
  },
  {
    id: "nft_004",
    title: "Digital Flora",
    description:
      "A series of digital flowers that bloom and change with time. Each flower is unique and responds to environmental data.",
    imageUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    creator: mockUsers[1],
    price: {
      amount: "1.5",
      currency: "ICP",
    },
    status: "auction",
    originStamp: {
      certificateId: "cert_004",
      creationProcess: true,
      verified: true,
    },
    likes: 123,
    views: 678,
    createdAt: "2024-01-25T16:20:00Z",
    tags: ["nature", "digital flora", "generative art", "interactive"],
    collection: "Digital Nature",
  },
  {
    id: "nft_005",
    title: "Cosmic Journey",
    description:
      "A journey through the cosmos, exploring the vastness of space and the beauty of celestial bodies.",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    creator: mockUsers[0],
    price: {
      amount: "4.0",
      currency: "ICP",
    },
    status: "for_sale",
    originStamp: {
      certificateId: "cert_005",
      creationProcess: true,
      verified: true,
    },
    likes: 567,
    views: 3456,
    createdAt: "2024-01-05T11:10:00Z",
    tags: ["space", "cosmos", "celestial", "sci-fi"],
    collection: "Cosmic Series",
  },
  {
    id: "nft_006",
    title: "Urban Minimalism",
    description:
      "Minimalist approach to urban photography, capturing the essence of city life through simple geometric forms.",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    creator: mockUsers[1],
    price: {
      amount: "0.8",
      currency: "ICP",
    },
    status: "for_sale",
    originStamp: {
      certificateId: "cert_006",
      creationProcess: true,
      verified: true,
    },
    likes: 89,
    views: 445,
    createdAt: "2024-01-30T13:25:00Z",
    tags: ["minimalism", "urban", "photography", "geometric"],
    collection: "Urban Minimalism",
  },
];

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: "collection_001",
    name: "Digital Dreams",
    description:
      "A collection exploring the intersection of dreams and digital reality. Each piece is created through a unique process combining AI and human creativity.",
    coverImage:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop",
    creator: mockUsers[0],
    nfts: [mockNFTs[0], mockNFTs[2]],
    stats: {
      totalItems: 12,
      floorPrice: "1.5 ICP",
      totalVolume: "28,450 ICP",
      owners: 8,
    },
  },
  {
    id: "collection_002",
    name: "Urban Futures",
    description:
      "Exploring the future of urban landscapes through digital art. From cyberpunk cities to minimalist architecture.",
    coverImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop",
    creator: mockUsers[1],
    nfts: [mockNFTs[1], mockNFTs[5]],
    stats: {
      totalItems: 8,
      floorPrice: "0.8 ICP",
      totalVolume: "15,230 ICP",
      owners: 5,
    },
  },
  {
    id: "collection_003",
    name: "Digital Nature",
    description:
      "A series of digital flora and fauna that respond to environmental data and change over time.",
    coverImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=300&fit=crop",
    creator: mockUsers[1],
    nfts: [mockNFTs[3]],
    stats: {
      totalItems: 5,
      floorPrice: "1.2 ICP",
      totalVolume: "8,900 ICP",
      owners: 3,
    },
  },
];

// Mock Categories
export const mockCategories = [
  "Digital Art",
  "Photography",
  "Abstract",
  "Portrait",
  "Landscape",
  "Sci-Fi",
  "Fantasy",
  "Minimalist",
  "Pop Art",
  "Surrealism",
];

// Mock Marketplace Stats
export const mockMarketplaceStats = {
  totalNFTs: 15420,
  totalVolume: "2,450,000 ICP",
  activeUsers: 8920,
  totalSales: 45670,
  averagePrice: "1.8 ICP",
  trendingCollections: mockCollections.slice(0, 3),
};
