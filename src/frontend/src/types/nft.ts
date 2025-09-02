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

export interface Creator {
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
  creator: Creator;
  nfts: NFT[];
  stats: {
    totalItems: number;
    floorPrice: string;
    totalVolume: string;
    owners: number;
  };
}

export interface MarketplaceStats {
  totalArtworks: string;
  totalAuctions: string;
  totalCreators: string;
}
