/**
 * Avatar Service Module
 * Handles avatar generation and management
 */

import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

export interface AvatarOptions {
  seed?: string;
  size?: number;
  backgroundColor?: string[];
}

export class AvatarService {
  private static instance: AvatarService;

  private constructor() {}

  static getInstance(): AvatarService {
    if (!AvatarService.instance) {
      AvatarService.instance = new AvatarService();
    }
    return AvatarService.instance;
  }

  generateAvatar(username: string, options: AvatarOptions = {}): string {
    const {
      seed = username,
      size = 128,
      backgroundColor = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    } = options;

    try {
      const avatar = createAvatar(lorelei, {
        seed,
        size,
        backgroundColor: [
          backgroundColor[Math.floor(Math.random() * backgroundColor.length)],
        ],
        radius: 50,
        scale: 80,
      });

      return avatar.toDataUri();
    } catch (error) {
      console.error("Failed to generate avatar:", error);
      return this.generateFallbackAvatar(username);
    }
  }

  generateRandomAvatar(options: AvatarOptions = {}): string {
    const randomSeed = Math.random().toString(36).substring(7);
    return this.generateAvatar(randomSeed, options);
  }

  private generateFallbackAvatar(username: string): string {
    const initial = username.charAt(0).toUpperCase();
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
    ];
    const bgColor = colors[username.length % colors.length];

    const svg = `
      <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" fill="${bgColor}" rx="64"/>
        <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${initial}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  generateAvatarUrl(username: string, options: AvatarOptions = {}): string {
    const {
      seed = username,
      size = 128,
      backgroundColor = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    } = options;

    try {
      const avatar = createAvatar(lorelei, {
        seed,
        size,
        backgroundColor: [
          backgroundColor[Math.floor(Math.random() * backgroundColor.length)],
        ],
        radius: 50,
        scale: 80,
      });

      return avatar.toString();
    } catch (error) {
      console.error("Failed to generate avatar URL:", error);
      return this.generateFallbackAvatar(username);
    }
  }
}

export const avatarService = AvatarService.getInstance();
