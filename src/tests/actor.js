import { Actor, HttpAgent } from "@dfinity/agent";
import fetch from "isomorphic-fetch";
import canisterIds from ".dfx/local/canister_ids.json";
import { idlFactory } from "../declarations/vibe_coding_template_backend/vibe_coding_template_backend.did.js";
import { identity } from "./identity.ts";

export const createActor = async (canisterId, options) => {
  const agent = new HttpAgent({ ...options?.agentOptions });
  await agent.fetchRootKey();

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const backendCanister = canisterIds.vibe_coding_template_backend.local;

export const hello = await createActor(backendCanister, {
  agentOptions: {
    host: "http://127.0.0.1:4943",
    fetch,
    identity: await identity,
  },
});