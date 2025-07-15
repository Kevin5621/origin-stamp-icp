import { describe, beforeEach, afterEach, it, expect, inject } from "vitest";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PocketIc, type Actor } from "@dfinity/pic";
import { Principal } from "@dfinity/principal";

// Import generated types for your canister
import {
  type _SERVICE,
  idlFactory,
} from "../../src/declarations/backend/backend.did.js";

// Define the path to your canister's WASM file
export const WASM_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "target",
  "wasm32-unknown-unknown",
  "release",
  "backend.wasm",
);

// The `describe` function is used to group tests together
describe("Vibe Coding Template Backend", () => {
  // Define variables to hold our PocketIC instance, canister ID,
  // and an actor to interact with our canister.
  let pic: PocketIc;
  // @ts-ignore - This variable is used in the setup / framework
  let canisterId: Principal;
  let actor: Actor<_SERVICE>;

  // The `beforeEach` hook runs before each test.
  beforeEach(async () => {
    // create a new PocketIC instance
    pic = await PocketIc.create(inject("PIC_URL"));

    // Setup the canister and actor
    const fixture = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: WASM_PATH,
    });

    // Save the actor and canister ID for use in tests
    actor = fixture.actor;
    canisterId = fixture.canisterId;
  });

  // The `afterEach` hook runs after each test.
  afterEach(async () => {
    // tear down the PocketIC instance
    await pic.tearDown();
  });

  // The `it` function is used to define individual tests
  it("should register a new user successfully", async () => {
    const username = "testuser";
    const password = "testpass123";

    const result = await actor.register_user(username, password);

    expect(result.success).toBe(true);
    expect(result.message).toBe("User registered successfully");
    expect(result.username).toEqual([username]);
  });

  it("should fail to register user with empty username", async () => {
    const result = await actor.register_user("", "password123");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Username and password cannot be empty");
    expect(result.username).toEqual([]);
  });

  it("should fail to register user with empty password", async () => {
    const result = await actor.register_user("testuser", "");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Username and password cannot be empty");
    expect(result.username).toEqual([]);
  });

  it("should fail to register duplicate username", async () => {
    const username = "duplicateuser";
    const password = "testpass123";

    // Register first user
    await actor.register_user(username, password);

    // Try to register same username again
    const result = await actor.register_user(username, password);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Username already exists");
    expect(result.username).toEqual([]);
  });

  it("should login successfully with correct credentials", async () => {
    const username = "loginuser";
    const password = "loginpass123";

    // First register the user
    await actor.register_user(username, password);

    // Then try to login
    const result = await actor.login(username, password);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Login successful");
    expect(result.username).toEqual([username]);
  });

  it("should fail login with incorrect password", async () => {
    const username = "loginuser2";
    const password = "correctpass123";
    const wrongPassword = "wrongpass123";

    // First register the user
    await actor.register_user(username, password);

    // Try to login with wrong password
    const result = await actor.login(username, wrongPassword);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid password");
    expect(result.username).toEqual([]);
  });

  it("should fail login with non-existent user", async () => {
    const result = await actor.login("nonexistentuser", "somepassword");

    expect(result.success).toBe(false);
    expect(result.message).toBe("User not found");
    expect(result.username).toEqual([]);
  });

  it("should fail login with empty credentials", async () => {
    const emptyUsernameResult = await actor.login("", "password123");
    expect(emptyUsernameResult.success).toBe(false);
    expect(emptyUsernameResult.message).toBe(
      "Username and password cannot be empty",
    );

    const emptyPasswordResult = await actor.login("username", "");
    expect(emptyPasswordResult.success).toBe(false);
    expect(emptyPasswordResult.message).toBe(
      "Username and password cannot be empty",
    );
  });
});
