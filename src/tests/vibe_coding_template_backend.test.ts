import { expect, test, describe, beforeEach } from "vitest";
import { Actor, CanisterStatus, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { backendCanister, hello } from "./actor";

test("should handle a basic greeting", async () => {
  const result1 = await hello.greet("test");
  expect(result1).toBe("Hello, test!");
});

test("Should contain a candid interface", async () => {
  const agent = Actor.agentOf(hello) as HttpAgent;
  const id = Principal.from(backendCanister);

  const canisterStatus = await CanisterStatus.request({
    canisterId: id,
    agent,
    paths: ["time", "controllers", "candid"],
  });

  expect(canisterStatus.get("time")).toBeTruthy();
  expect(Array.isArray(canisterStatus.get("controllers"))).toBeTruthy();
  expect(canisterStatus.get("candid")).toMatchInlineSnapshot(`
    "service : {
      get_count : () -> (nat64) query;
      greet : (text) -> (text) query;
      increment : () -> (nat64);
    }
    "
  `);
});

describe("Counter functionality", () => {
  // Reset counter state before tests if possible
  // Note: In production this might not be possible depending on canister setup
  
  test("should return current count", async () => {
    const count = await hello.get_count();
    // We can only verify it's a number since we don't know the current state
    expect(typeof count).toBe("bigint");
  });

  test("should increment counter", async () => {
    // Get initial count
    const initialCount = await hello.get_count() as bigint;
    
    // Increment counter
    const newCount = await hello.increment() as bigint;
    
    // Verify increment happened
    expect(newCount).toBe(initialCount + 1n);
    
    // Verify get_count returns the new value
    const currentCount = await hello.get_count() as bigint;
    expect(currentCount).toBe(newCount);
  });

  test("should increment multiple times", async () => {
    // Get initial count
    const initialCount = await hello.get_count() as bigint;
    
    // Increment twice
    await hello.increment();
    const newCount = await hello.increment() as bigint;
    
    // Verify counter increased by 2
    expect(newCount).toBe(initialCount + 2n);
  });
});
