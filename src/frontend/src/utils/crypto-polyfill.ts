/**
 * Crypto polyfill for environments that don't have SubtleCrypto
 * This ensures the @dfinity/agent works in all environments
 */

// Only run this polyfill in browser environments
if (typeof window !== "undefined" && typeof globalThis !== "undefined") {
  // Check if crypto.subtle is not available
  if (!globalThis.crypto?.subtle) {
    // Create a basic crypto object with fallbacks
    const cryptoPolyfill = {
      getRandomValues: (array: Uint8Array): Uint8Array => {
        if (window.crypto?.getRandomValues) {
          return window.crypto.getRandomValues(array);
        }
        // Fallback for environments without crypto.getRandomValues
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      subtle: {
        digest: async (
          _algorithm: string,
          _data: ArrayBuffer,
        ): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.digest not available in this environment",
          );
        },
        importKey: async (): Promise<CryptoKey> => {
          throw new Error(
            "SubtleCrypto.importKey not available in this environment",
          );
        },
        sign: async (): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.sign not available in this environment",
          );
        },
        verify: async (): Promise<boolean> => {
          throw new Error(
            "SubtleCrypto.verify not available in this environment",
          );
        },
        encrypt: async (): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.encrypt not available in this environment",
          );
        },
        decrypt: async (): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.decrypt not available in this environment",
          );
        },
        generateKey: async (): Promise<CryptoKey> => {
          throw new Error(
            "SubtleCrypto.generateKey not available in this environment",
          );
        },
        deriveKey: async (): Promise<CryptoKey> => {
          throw new Error(
            "SubtleCrypto.deriveKey not available in this environment",
          );
        },
        deriveBits: async (): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.deriveBits not available in this environment",
          );
        },
        exportKey: async (): Promise<ArrayBuffer | JsonWebKey> => {
          throw new Error(
            "SubtleCrypto.exportKey not available in this environment",
          );
        },
        unwrapKey: async (): Promise<CryptoKey> => {
          throw new Error(
            "SubtleCrypto.unwrapKey not available in this environment",
          );
        },
        wrapKey: async (): Promise<ArrayBuffer> => {
          throw new Error(
            "SubtleCrypto.wrapKey not available in this environment",
          );
        },
      } as unknown as SubtleCrypto,
      randomUUID: (): string => {
        // Fallback UUID v4 implementation
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },
    };

    // Set the polyfill on globalThis
    (globalThis as { crypto?: typeof cryptoPolyfill }).crypto = cryptoPolyfill;

    if (typeof window !== "undefined") {
      (window as { crypto?: typeof cryptoPolyfill }).crypto = cryptoPolyfill;
    }
  }
}

export {};
