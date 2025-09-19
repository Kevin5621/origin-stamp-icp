/**
 * Crypto polyfill for environments that don't have SubtleCrypto
 * This ensures the @dfinity/agent works in all environments
 */

// Only run this polyfill in browser environments
if (typeof window !== "undefined") {
  // Check if crypto.subtle is not available
  if (!window.crypto?.subtle) {
    console.warn("SubtleCrypto not available, loading polyfill...");

    // Import webcrypto polyfill
    import("@peculiar/webcrypto")
      .then(({ Crypto }) => {
        const crypto = new Crypto();

        // Polyfill the global crypto object
        if (!window.crypto) {
          Object.defineProperty(window, "crypto", {
            value: crypto,
            writable: true,
            configurable: true,
          });
        } else {
          Object.defineProperty(window.crypto, "subtle", {
            value: crypto.subtle,
            writable: true,
            configurable: true,
          });
        }

        console.log("✅ SubtleCrypto polyfill loaded successfully");
      })
      .catch((error) => {
        console.error("❌ Failed to load SubtleCrypto polyfill:", error);
      });
  }
}

export {};
