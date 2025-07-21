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

  // User query functions tests
  it("should get all users", async () => {
    const users = ["user1", "user2", "user3"];
    const password = "testpass123";

    // Register multiple users
    for (const username of users) {
      await actor.register_user(username, password);
    }

    const result = await actor.get_all_users();

    expect(result.length).toBe(users.length);
    expect(result).toEqual(expect.arrayContaining(users));
  });

  it("should get empty array when no users exist", async () => {
    const result = await actor.get_all_users();
    expect(result).toEqual([]);
  });

  it("should get user info for existing user", async () => {
    const username = "infouser";
    const password = "testpass123";

    // Register user first
    await actor.register_user(username, password);

    const result = await actor.get_user_info(username);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      expect.arrayContaining([username, expect.any(BigInt)]),
    );
  });

  it("should return empty array for non-existent user info", async () => {
    const result = await actor.get_user_info("nonexistentuser");
    expect(result).toEqual([]);
  });

  it("should get correct user count", async () => {
    // Initially no users
    let count = await actor.get_user_count();
    expect(count).toBe(0n);

    // Register some users
    await actor.register_user("user1", "pass123");
    await actor.register_user("user2", "pass123");

    count = await actor.get_user_count();
    expect(count).toBe(2n);

    // Register one more
    await actor.register_user("user3", "pass123");
    count = await actor.get_user_count();
    expect(count).toBe(3n);
  });

  // Physical Art Session tests
  it("should create physical art session successfully", async () => {
    const username = "artist";
    const artTitle = "Beautiful Painting";
    const description = "A wonderful landscape painting";

    const result = await actor.create_physical_art_session(
      username,
      artTitle,
      description,
    );

    expect("Err" in result).toBe(false);
    expect("Ok" in result).toBe(true);
    if ("Ok" in result) {
      expect(typeof result.Ok).toBe("string");
      expect(result.Ok.length).toBeGreaterThan(0);
    }
  });

  it("should get session details for existing session", async () => {
    const username = "artist";
    const artTitle = "Test Art";
    const description = "Test Description";

    // Create session first
    const createResult = await actor.create_physical_art_session(
      username,
      artTitle,
      description,
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    const sessionDetails = await actor.get_session_details(sessionId);

    expect(sessionDetails.length).toBe(1);
    const session = sessionDetails[0];
    if (!session) {
      throw new Error("Session should be defined");
    }
    expect(session.session_id).toBe(sessionId);
    expect(session.username).toBe(username);
    expect(session.art_title).toBe(artTitle);
    expect(session.description).toBe(description);
    expect(session.uploaded_photos).toEqual([]);
    expect(session.status).toBe("draft");
    expect(session.created_at).toBeDefined();
    expect(session.updated_at).toBeDefined();
  });

  it("should return empty array for non-existent session details", async () => {
    const result = await actor.get_session_details("nonexistent-session-id");
    expect(result).toEqual([]);
  });

  it("should get user sessions", async () => {
    const username = "sessionuser";
    const titles = ["Art 1", "Art 2", "Art 3"];

    // Create multiple sessions for user
    const sessionIds = [];
    for (const title of titles) {
      const result = await actor.create_physical_art_session(
        username,
        title,
        `Description for ${title}`,
      );
      expect("Ok" in result).toBe(true);
      if ("Ok" in result) {
        sessionIds.push(result.Ok);
      }
    }

    // Create session for different user
    await actor.create_physical_art_session(
      "otheruser",
      "Other Art",
      "Other Description",
    );

    const userSessions = await actor.get_user_sessions(username);

    expect(userSessions.length).toBe(titles.length);
    const sessionTitles = userSessions.map((s) => s.art_title);
    expect(sessionTitles).toEqual(expect.arrayContaining(titles));
  });

  it("should return empty array for user with no sessions", async () => {
    const result = await actor.get_user_sessions("userwithoutsessions");
    expect(result).toEqual([]);
  });

  it("should update session status successfully", async () => {
    const username = "statususer";
    const artTitle = "Status Test Art";
    const description = "Testing status updates";

    // Create session
    const createResult = await actor.create_physical_art_session(
      username,
      artTitle,
      description,
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    // Update status
    const updateResult = await actor.update_session_status(
      sessionId,
      "completed",
    );

    expect("Err" in updateResult).toBe(false);
    expect("Ok" in updateResult).toBe(true);
    if ("Ok" in updateResult) {
      expect(updateResult.Ok).toBe(true);
    }

    // Verify status was updated
    const sessionDetails = await actor.get_session_details(sessionId);
    expect(sessionDetails.length).toBe(1);
    if (!sessionDetails[0]) {
      throw new Error("Session details should be defined");
    }
    expect(sessionDetails[0].status).toBe("completed");
  });

  it("should fail to update status for non-existent session", async () => {
    const result = await actor.update_session_status(
      "nonexistent-session",
      "completed",
    );

    expect("Ok" in result).toBe(false);
    expect("Err" in result).toBe(true);
    if ("Err" in result) {
      expect(result.Err).toBe("Session not found");
    }
  });

  it("should upload photo to session successfully", async () => {
    const username = "photouser";
    const artTitle = "Photo Test Art";
    const description = "Testing photo upload";
    const photoUrl = "https://example.com/photo.jpg";

    // Create session
    const createResult = await actor.create_physical_art_session(
      username,
      artTitle,
      description,
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    // Upload photo
    const uploadResult = await actor.upload_photo_to_session(
      sessionId,
      photoUrl,
    );

    expect("Err" in uploadResult).toBe(false);
    expect("Ok" in uploadResult).toBe(true);
    if ("Ok" in uploadResult) {
      expect(uploadResult.Ok).toBe(true);
    }

    // Verify photo was added
    const sessionDetails = await actor.get_session_details(sessionId);
    expect(sessionDetails.length).toBe(1);
    if (!sessionDetails[0]) {
      throw new Error("Session details should be defined");
    }
    expect(sessionDetails[0].uploaded_photos).toContain(photoUrl);
  });

  it("should fail to upload photo to non-existent session", async () => {
    const result = await actor.upload_photo_to_session(
      "nonexistent-session",
      "https://example.com/photo.jpg",
    );

    expect("Ok" in result).toBe(false);
    expect("Err" in result).toBe(true);
    if ("Err" in result) {
      expect(result.Err).toBe("Session not found");
    }
  });

  it("should remove photo from session successfully", async () => {
    const username = "removeuser";
    const artTitle = "Remove Test Art";
    const description = "Testing photo removal";
    const photoUrl1 = "https://example.com/photo1.jpg";
    const photoUrl2 = "https://example.com/photo2.jpg";

    // Create session
    const createResult = await actor.create_physical_art_session(
      username,
      artTitle,
      description,
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    // Upload photos
    await actor.upload_photo_to_session(sessionId, photoUrl1);
    await actor.upload_photo_to_session(sessionId, photoUrl2);

    // Remove one photo
    const removeResult = await actor.remove_photo_from_session(
      sessionId,
      photoUrl1,
    );

    expect("Err" in removeResult).toBe(false);
    expect("Ok" in removeResult).toBe(true);
    if ("Ok" in removeResult) {
      expect(removeResult.Ok).toBe(true);
    }

    // Verify photo was removed
    const sessionDetails = await actor.get_session_details(sessionId);
    expect(sessionDetails.length).toBe(1);
    if (!sessionDetails[0]) {
      throw new Error("Session details should be defined");
    }
    expect(sessionDetails[0].uploaded_photos).not.toContain(photoUrl1);
    expect(sessionDetails[0].uploaded_photos).toContain(photoUrl2);
  });

  it("should fail to remove photo from non-existent session", async () => {
    const result = await actor.remove_photo_from_session(
      "nonexistent-session",
      "https://example.com/photo.jpg",
    );

    expect("Ok" in result).toBe(false);
    expect("Err" in result).toBe(true);
    if ("Err" in result) {
      expect(result.Err).toBe("Session not found");
    }
  });

  // S3 Configuration tests
  it("should configure S3 settings successfully", async () => {
    const s3Config = {
      bucket_name: "test-bucket",
      region: "us-east-1",
      access_key_id: "test-access-key",
      secret_access_key: "test-secret-key",
      endpoint: [] as [] | [string],
    };

    const result = await actor.configure_s3(s3Config);
    expect(result).toBe(true);
  });

  it("should set S3 config successfully (alias)", async () => {
    const s3Config = {
      bucket_name: "test-bucket-2",
      region: "us-west-2",
      access_key_id: "test-access-key-2",
      secret_access_key: "test-secret-key-2",
      endpoint: ["https://custom-endpoint.com"] as [] | [string],
    };

    const result = await actor.set_s3_config(s3Config);
    expect(result).toBe(true);
  });

  it("should get S3 config status when configured", async () => {
    const s3Config = {
      bucket_name: "status-test-bucket",
      region: "eu-west-1",
      access_key_id: "status-test-access-key",
      secret_access_key: "status-test-secret-key",
      endpoint: [] as [] | [string],
    };

    // Initially should be false
    let status = await actor.get_s3_config_status();
    expect(status).toBe(false);

    // Configure S3
    await actor.configure_s3(s3Config);

    // Now should be true
    status = await actor.get_s3_config_status();
    expect(status).toBe(true);
  });

  it("should get S3 configuration", async () => {
    const s3Config = {
      bucket_name: "get-test-bucket",
      region: "ap-southeast-1",
      access_key_id: "get-test-access-key",
      secret_access_key: "get-test-secret-key",
      endpoint: ["https://minio.example.com"] as [] | [string],
    };

    // Configure S3
    await actor.configure_s3(s3Config);

    // Get config
    const retrievedConfig = await actor.get_s3_config();

    expect(retrievedConfig.length).toBe(1);
    const config = retrievedConfig[0];
    if (!config) {
      throw new Error("Config should be defined");
    }
    expect(config.bucket_name).toBe(s3Config.bucket_name);
    expect(config.region).toBe(s3Config.region);
    expect(config.access_key_id).toBe(s3Config.access_key_id);
    expect(config.secret_access_key).toBe(s3Config.secret_access_key);
    expect(config.endpoint).toEqual(s3Config.endpoint);
  });

  it("should return empty array when no S3 config exists", async () => {
    const result = await actor.get_s3_config();
    expect(result).toEqual([]);
  });

  it("should generate upload URL when S3 is configured", async () => {
    const s3Config = {
      bucket_name: "upload-test-bucket",
      region: "us-east-1",
      access_key_id: "upload-test-access-key",
      secret_access_key: "upload-test-secret-key",
      endpoint: [] as [] | [string],
    };

    // Configure S3
    await actor.configure_s3(s3Config);

    // Create session
    const createResult = await actor.create_physical_art_session(
      "uploaduser",
      "Upload Test",
      "Testing uploads",
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    const fileData = {
      filename: "test-image.jpg",
      content_type: "image/jpeg",
      file_size: 1024n,
    };

    const result = await actor.generate_upload_url(sessionId, fileData);

    expect("Err" in result).toBe(false);
    expect("Ok" in result).toBe(true);
    if ("Ok" in result) {
      expect(result.Ok).toContain(s3Config.bucket_name);
      expect(result.Ok).toContain(s3Config.region);
      expect(result.Ok).toContain(sessionId);
      expect(result.Ok).toContain(fileData.filename);
    }
  });

  it("should generate upload URL with custom endpoint", async () => {
    const s3Config = {
      bucket_name: "custom-bucket",
      region: "us-east-1",
      access_key_id: "custom-access-key",
      secret_access_key: "custom-secret-key",
      endpoint: ["https://minio.example.com"] as [] | [string],
    };

    // Configure S3 with custom endpoint
    await actor.configure_s3(s3Config);

    // Create session
    const createResult = await actor.create_physical_art_session(
      "customuser",
      "Custom Test",
      "Testing custom endpoint",
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    const fileData = {
      filename: "custom-test.png",
      content_type: "image/png",
      file_size: 2048n,
    };

    const result = await actor.generate_upload_url(sessionId, fileData);

    expect("Err" in result).toBe(false);
    expect("Ok" in result).toBe(true);
    if ("Ok" in result) {
      expect(result.Ok).toContain("minio.example.com");
      expect(result.Ok).toContain(sessionId);
      expect(result.Ok).toContain(fileData.filename);
    }
  });

  it("should fail to generate upload URL when S3 is not configured", async () => {
    // Create session
    const createResult = await actor.create_physical_art_session(
      "noconfig",
      "No Config Test",
      "Testing without S3 config",
    );
    expect("Ok" in createResult).toBe(true);
    if (!("Ok" in createResult)) return;

    const sessionId = createResult.Ok;

    const fileData = {
      filename: "no-config-test.jpg",
      content_type: "image/jpeg",
      file_size: 512n,
    };

    const result = await actor.generate_upload_url(sessionId, fileData);

    expect("Ok" in result).toBe(false);
    expect("Err" in result).toBe(true);
    if ("Err" in result) {
      expect(result.Err).toBe(
        "S3 configuration not found. Please configure S3 settings first.",
      );
    }
  });
});
