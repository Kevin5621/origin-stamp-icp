import { icpAgentService } from "./icpAgentService";
import { envService } from "./envService";
// Generated fallback actor
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { backend } from "../../../declarations/backend";
import { idlFactory } from "../../../declarations/backend/backend.did.js";
import type {
  _SERVICE as BackendActor,
  Token,
} from "../../../declarations/backend/backend.did";
import { Actor } from "@dfinity/agent";
import type { NFT, Collection } from "@/types/nft";

// Reusable helper types
interface FilterOptions {
  status?: "for_sale" | "sold" | "auction";
  creator?: string;
}

// (Reserved for future create operation)
interface CreateNFTData {
  title: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
} // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SearchResult {
  nfts: NFT[];
  collections: Collection[];
  users: string[];
  total: number;
  hasMore: boolean;
}

type BackendToken = Token;

async function createBackendActor(): Promise<BackendActor> {
  if (typeof window !== "undefined") {
    try {
      const canisterId = envService.getBackendCanisterId();
      const agent = await icpAgentService.getAgent();
      return Actor.createActor(idlFactory as never, {
        agent,
        canisterId,
      }) as unknown as BackendActor;
    } catch (err) {
      console.warn(
        "[MarketplaceService] Dynamic actor creation failed, using fallback",
        err,
      );
    }
  }
  return backend as unknown as BackendActor;
}

export class MarketplaceService {
  /**
   * Fetch all NFTs from backend canister (paginated internally if needed)
   */
  static async getNFTs(filters: Partial<FilterOptions> = {}): Promise<NFT[]> {
    // Currently unused filters placeholder
    void filters; // eslint-disable-line @typescript-eslint/no-unused-expressions
    if (typeof window === "undefined") return [];
    try {
      const actor = await createBackendActor();
      const rawIds = await actor.icrc7_tokens([], [BigInt(100)]);
      const tokenIds: bigint[] = Array.isArray(rawIds)
        ? Array.from(rawIds as unknown as bigint[])
        : [];
      if (!tokenIds.length) return [];
      const detailed = await Promise.all(
        tokenIds.map(async (id) => {
          try {
            const details = await actor.get_token_details(id);
            if (!details.length) return null;
            return this.convertTokenToNFT(details[0]!);
          } catch (err) {
            console.warn(
              "[MarketplaceService] token fetch failed",
              id.toString(),
              err,
            );
            return null;
          }
        }),
      );
      return detailed.filter((n): n is NFT => n !== null);
    } catch (err) {
      console.error("[MarketplaceService] getNFTs failed", err);
      return [];
    }
  }

  private static convertTokenToNFT(token: BackendToken): NFT {
    const description = Array.isArray(token.metadata.description)
      ? token.metadata.description[0] || ""
      : (token.metadata.description as string) || "";
    const imageUrl = Array.isArray(token.metadata.image)
      ? token.metadata.image[0] || ""
      : (token.metadata.image as string) || "";
    const createdMs = Number(token.created_at) / 1_000_000; // ns -> ms
    const sessionId: string = token.session_id.length
      ? token.session_id[0]!
      : "";

    return {
      id: token.id.toString(),
      title: token.metadata.name || `NFT #${token.id.toString()}`,
      description,
      imageUrl:
        imageUrl ||
        `https://via.placeholder.com/600x600?text=NFT+${token.id.toString()}`,
      creator: {
        username: token.owner.owner.toString().slice(0, 10) + "...",
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
  static async searchNFTs(q: string): Promise<SearchResult> {
    void q; // placeholder
    return { nfts: [], collections: [], users: [], total: 0, hasMore: false };
  }
}
