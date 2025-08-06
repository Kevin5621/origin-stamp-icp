// src/frontend/src/services/originStampDashboardService.ts
export interface OriginStampStats {
  totalArtworks: number;
  verifiedArtworks: number;
  certificatesIssued: number;
  activeSessions: number;
  processLogs: number;
  verificationScore: number;
  portfolioValue: number;
  monthlyGrowth: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  featured?: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'artwork_verified' | 'certificate_issued' | 'session_started' | 'process_logged' | 'nft_minted';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ArtworkOverview {
  id: string;
  name: string;
  type: 'painting' | 'sculpture' | 'digital_art' | 'photography' | 'mixed_media';
  status: 'draft' | 'logging' | 'verified' | 'minted';
  progress: number;
  verificationEntries: number;
  dueDate?: Date;
  lastActivity: Date;
  thumbnail?: string;
  blockchainHash?: string;
}

export interface UpcomingDeadline {
  id: string;
  projectName: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  type: 'verification' | 'minting' | 'exhibition' | 'auction';
}

// OriginStamp service for art verification dashboard
export class OriginStampDashboardService {
  static async getDashboardStats(): Promise<OriginStampStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalArtworks: 18,
      verifiedArtworks: 12,
      certificatesIssued: 10,
      activeSessions: 2,
      processLogs: 347,
      verificationScore: 96.8,
      portfolioValue: 1800000000, // IDR
      monthlyGrowth: 18.5
    };
  }

  static async getQuickActions(): Promise<QuickAction[]> {
    return [
      {
        id: 'start-verification',
        title: 'Start New Verification',
        description: 'Begin documenting a new artwork creation process',
        icon: 'plus',
        action: '/session',
        featured: true
      },
      {
        id: 'view-certificates',
        title: 'View NFT Certificates',
        description: 'Browse your minted authenticity certificates',
        icon: 'certificate',
        action: '/certificates'
      },
      {
        id: 'check-analytics',
        title: 'Verification Analytics',
        description: 'Review your creation process metrics',
        icon: 'chart',
        action: '/analytics'
      },
      {
        id: 'browse-portfolio',
        title: 'Portfolio Management',
        description: 'Organize your verified artworks',
        icon: 'folder',
        action: '/portfolio'
      }
    ];
  }

  static async getRecentActivity(): Promise<RecentActivity[]> {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'artwork_verified',
        title: 'Artwork Verification Complete',
        description: '"Digital Waves #3" has been successfully verified with 127 process entries',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        metadata: { projectId: 'art-001', entriesCount: 127 }
      },
      {
        id: '2',
        type: 'nft_minted',
        title: 'NFT Certificate Minted',
        description: 'Authenticity certificate for "Abstract Storm" minted on Internet Computer',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        metadata: { tokenId: 'OST-2024-001' }
      },
      {
        id: '3',
        type: 'process_logged',
        title: 'Process Data Logged',
        description: 'New creation steps recorded for "Urban Symphony" project',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        metadata: { logCount: 15 }
      },
      {
        id: '4',
        type: 'session_started',
        title: 'Verification Session Started',
        description: 'New recording session for physical sculpture documentation',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: '5',
        type: 'process_logged',
        title: 'Creation Process Captured',
        description: 'Key milestones recorded for "Nature\'s Geometry" artwork',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000), // 18 hours ago
      }
    ];
  }

  static async getArtworkOverviews(): Promise<ArtworkOverview[]> {
    const now = new Date();
    return [
      {
        id: 'art-001',
        name: 'Digital Waves #3',
        type: 'digital_art',
        status: 'verified',
        progress: 100,
        verificationEntries: 127,
        lastActivity: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        thumbnail: 'https://via.placeholder.com/150x150/4a90a4/ffffff?text=DW',
        blockchainHash: 'bafybeih4...'
      },
      {
        id: 'art-002',
        name: 'Abstract Storm',
        type: 'painting',
        status: 'minted',
        progress: 100,
        verificationEntries: 89,
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        lastActivity: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        thumbnail: 'https://via.placeholder.com/150x150/ed8936/ffffff?text=AS',
        blockchainHash: 'bafybeid3...'
      },
      {
        id: 'art-003',
        name: 'Urban Symphony',
        type: 'mixed_media',
        status: 'logging',
        progress: 65,
        verificationEntries: 42,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        lastActivity: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        thumbnail: 'https://via.placeholder.com/150x150/38a169/ffffff?text=US'
      },
      {
        id: 'art-004',
        name: 'Nature\'s Geometry',
        type: 'sculpture',
        status: 'draft',
        progress: 25,
        verificationEntries: 8,
        lastActivity: new Date(now.getTime() - 18 * 60 * 60 * 1000),
        thumbnail: 'https://via.placeholder.com/150x150/e53e3e/ffffff?text=NG'
      }
    ];
  }

  static async getUpcomingDeadlines(): Promise<UpcomingDeadline[]> {
    const now = new Date();
    return [
      {
        id: 'deadline-001',
        projectName: 'Abstract Storm',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
        priority: 'high',
        type: 'minting'
      },
      {
        id: 'deadline-002',
        projectName: 'Urban Symphony',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        priority: 'medium',
        type: 'verification'
      },
      {
        id: 'deadline-003',
        projectName: 'Digital Waves #3',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
        priority: 'medium',
        type: 'exhibition'
      }
    ];
  }
}
