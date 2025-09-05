import { backendService, getBackendActor } from "./backendService";
// Direct generated canister (for fallback / SSR-safe queries)
// NOTE: path requires going up three levels to reach root src directory
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { backend } from "../../../declarations/backend";
import type { NFT, Collection } from "@/types/nft";

// Reusable helper types
interface FilterOptions {
  status?: "for_sale" | "sold" | "auction";
  creator?: string;
}

interface CreateNFTData {
  title: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface SearchResult {
  nfts: NFT[];
  collections: Collection[];
  users: string[];
  total: number;
  hasMore: boolean;
}

// Minimal subset of backend Token type (mirrors candid) for local mapping
interface BackendTokenMetadataAttribute {
  trait_type: string;
  value: string;
}
interface BackendTokenMetadata {
  name: string;
  description: string | string[];
  image: string | string[];
  attributes: BackendTokenMetadataAttribute[];
}
interface BackendTokenOwner {
  owner: { owner: unknown };
}
interface BackendToken {
  id: bigint;
  metadata: BackendTokenMetadata;
  owner: BackendTokenOwner;
  created_at: bigint; // nanoseconds
  session_id: [] | [string];
}

export class MarketplaceService {
  /**
   * Fetch all NFTs from backend canister (paginated internally if needed)
   */
  static async getNFTs(_filters: Partial<FilterOptions> = {}): Promise<NFT[]> {
    try {
      // Avoid running during SSR
      if (typeof window === "undefined") return [];

      const backendActor = await getBackendActor().catch((e) => {
        console.warn("getBackendActor failed, falling back to static actor", e);
        return null;
      });
      // Prefer dynamic actor, fallback to static imported one
      const actor = backendActor || (backend as unknown);
      if (!actor) return [];

      // Pull first page (could iterate if large). Using null pagination = all small sets.
      // candid: icrc7_tokens(opt prev, opt take)
      // We'll request first 100 for now.
      const tokenIds: bigint[] = await (actor as any).icrc7_tokens(
        [],
        [BigInt(100)],
      );
      console.debug(
        "[MarketplaceService] Fetched token IDs",
        tokenIds.map((t) => t.toString()),
      );
      if (!tokenIds || tokenIds.length === 0) return [];

      const nftPromises = tokenIds.map(async (tokenId) => {
        try {
          const details = await (actor as any).get_token_details(tokenId);
          if (!details || details.length === 0) return null;
          const token = details[0] as unknown as BackendToken;
          console.debug(
            "[MarketplaceService] Token detail loaded",
            tokenId.toString(),
          );
          return this.convertTokenToNFT(token);
        } catch (e) {
          console.warn("Failed token detail", tokenId.toString(), e);
          return null;
        }
      });

      const tokens = await Promise.all(nftPromises);
      return tokens.filter((t): t is NFT => !!t);
    } catch (error) {
      console.error("Failed to load NFTs", error);
      return [];
    }
  }

  private static convertTokenToNFT(token: BackendToken): NFT {
    const description = Array.isArray(token.metadata.description)
      ? token.metadata.description[0] || ""
      : token.metadata.description || "";
    const imageUrl = Array.isArray(token.metadata.image)
      ? token.metadata.image[0] || ""
      : token.metadata.image || "";
    const createdMs = Number(token.created_at) / 1_000_000; // ns -> ms
    const sessionId: string =
      (token.session_id && token.session_id.length > 0
        ? token.session_id[0]
        : "") || "";

    return {
      id: token.id.toString(),
      title: token.metadata.name || `NFT #${token.id.toString()}`,
      description,
      imageUrl:
        imageUrl ||
        `https://via.placeholder.com/600x600?text=NFT+${token.id.toString()}`,
      creator: {
        username:
          String((token.owner as any)?.owner?.toString?.() || "unknown").slice(
            0,
            10,
          ) + "...",
        avatar: "",
        verified: true,
      },
      price: { amount: "0", currency: "ICP" },
      status: "for_sale",
      originStamp: {
        certificateId: sessionId,
        creationProcess: !!sessionId,
        verified: true,
      },
      likes: 0,
      views: 0,
      createdAt: new Date(createdMs).toISOString(),
      tags:
        token.metadata.attributes?.map((a) => `${a.trait_type}:${a.value}`) ||
        [],
      collection: sessionId ? `Session ${sessionId}` : undefined,
    };
  }

  // Placeholder unimplemented API surface to align with legacy version
  static async getCollections(): Promise<Collection[]> {
    return [];
  }
  static async searchNFTs(_q: string): Promise<SearchResult> {
    return { nfts: [], collections: [], users: [], total: 0, hasMore: false };
  }
}
