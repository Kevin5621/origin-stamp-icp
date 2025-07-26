// Marketplace Types
export interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  price: {
    amount: string;
    currency: "ICP" | "USD";
  };
  status: "for_sale" | "sold" | "auction";
  originStamp: {
    certificateId: string;
    creationProcess: boolean;
    verified: boolean;
  };
  likes: number;
  views: number;
  createdAt: string;
  tags: string[];
  collection?: string;
}

export interface User {
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  totalSales: number;
  totalVolume: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  creator: User;
  nfts: NFT[];
  stats: {
    totalItems: number;
    floorPrice: string;
    totalVolume: string;
    owners: number;
  };
}

export interface FilterOptions {
  category: string[];
  priceRange: {
    min: number;
    max: number;
  };
  status: "all" | "for_sale" | "sold" | "auction";
  originStampVerified: boolean;
  creatorVerified: boolean;
  sortBy: "newest" | "oldest" | "price_low" | "price_high" | "popular";
}

export interface SearchResult {
  nfts: NFT[];
  collections: Collection[];
  users: User[];
  total: number;
  hasMore: boolean;
}

export interface CreateNFTData {
  title: string;
  description: string;
  price: string;
  currency: "ICP" | "USD";
  tags: string[];
  collection?: string;
  file: File | null;
}
