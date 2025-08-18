import type { NFT, User, Collection } from "../types/marketplace";

// TODO: Load real users from backend
export const users: User[] = [];

// TODO: Load real NFTs from backend
export const nfts: NFT[] = [];

// TODO: Load real collections from backend
export const collections: Collection[] = [];

// TODO: Load real categories from backend
export const categories: string[] = [];

// TODO: Load real marketplace stats from backend
export const marketplaceStats = {
  totalNFTs: 0,
  totalVolume: "0 ICP",
  activeUsers: 0,
  totalSales: 0,
  averagePrice: "0 ICP",
  trendingCollections: [],
};
