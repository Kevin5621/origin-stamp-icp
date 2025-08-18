import { ChartDataPoint, CollectionStat, StatMetric, TimeRangeType } from "./types";

// Icons as SVG strings
const icons = {
  volume: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6.5l5-3v10l-5-3v7.5"></path><path d="M8 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path><path d="M19 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4"></path><path d="M2 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0"></path><path d="M22 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></svg>`,
  nfts: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M11 9h4"></path><path d="M11 13h4"></path><path d="M11 17h4"></path><path d="M7 9h0.01"></path><path d="M7 13h0.01"></path><path d="M7 17h0.01"></path></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  collections: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>`,
  floor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>`,
  change: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`
};

// Time ranges
export const timeRanges = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All Time" }
];

// Generate summary metrics based on selected time range
export const generateSummaryMetrics = (timeRange: TimeRangeType): StatMetric[] => {
  // Different data based on time range
  const data = {
    "24h": {
      volume: 241.5,
      nftsSold: 43,
      activeUsers: 185,
      collections: 12,
      floorPrice: 1.2,
      salesChange: 8.5
    },
    "7d": {
      volume: 1452.8,
      nftsSold: 267,
      activeUsers: 623,
      collections: 24,
      floorPrice: 1.45,
      salesChange: 12.7
    },
    "30d": {
      volume: 5921.4,
      nftsSold: 1243,
      activeUsers: 2184,
      collections: 48,
      floorPrice: 1.86,
      salesChange: -5.2
    },
    "all": {
      volume: 24893.2,
      nftsSold: 6521,
      activeUsers: 8745,
      collections: 92,
      floorPrice: 2.15,
      salesChange: 142.3
    }
  };

  const selectedData = data[timeRange];

  return [
    {
      id: "volume",
      title: "Total Volume",
      value: `${selectedData.volume.toFixed(1)} ETH`,
      icon: icons.volume,
      trend: timeRange === "30d" ? -2.1 : 4.2,
    },
    {
      id: "nfts",
      title: "NFTs Sold",
      value: selectedData.nftsSold,
      icon: icons.nfts,
      trend: timeRange === "30d" ? -3.8 : 7.5,
    },
    {
      id: "users",
      title: "Active Users",
      value: selectedData.activeUsers,
      icon: icons.users,
      trend: 12.3,
    },
    {
      id: "collections",
      title: "Total Collections",
      value: selectedData.collections,
      icon: icons.collections,
      trend: 5.6,
    },
    {
      id: "floor",
      title: "Floor Price (avg)",
      value: `${selectedData.floorPrice.toFixed(2)} ETH`,
      icon: icons.floor,
      trend: timeRange === "30d" ? -1.4 : 3.2,
    },
    {
      id: "change",
      title: "Sales Change",
      value: `${selectedData.salesChange.toFixed(1)}%`,
      icon: icons.change,
      trend: selectedData.salesChange,
    },
  ];
};

// Generate volume chart data based on time range
export const generateVolumeData = (timeRange: TimeRangeType): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = [];

  let days;
  switch (timeRange) {
    case "24h":
      // Hourly data for 24h
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0");
        dataPoints.push({
          date: `${hour}:00`,
          value: 5 + Math.random() * 15
        });
      }
      break;
      
    case "7d":
      // Daily data for 7 days
      days = 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: 50 + Math.random() * 150
        });
      }
      break;
      
    case "30d":
      // Daily data for 30 days
      days = 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: 120 + Math.random() * 80
        });
      }
      break;
      
    case "all":
      // Monthly data
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          value: 500 + Math.random() * 1500
        });
      }
      break;
  }

  return dataPoints;
};

// Generate sales data
export const generateSalesData = (timeRange: TimeRangeType): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = [];

  let days;
  switch (timeRange) {
    case "24h":
      // Hourly data for 24h
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0");
        dataPoints.push({
          date: `${hour}:00`,
          sales: Math.floor(1 + Math.random() * 5)
        });
      }
      break;
      
    case "7d":
      // Daily data for 7 days
      days = 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sales: Math.floor(10 + Math.random() * 30)
        });
      }
      break;
      
    case "30d":
      // Daily data for 30 days
      days = 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sales: Math.floor(15 + Math.random() * 25)
        });
      }
      break;
      
    case "all":
      // Monthly data
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        dataPoints.push({
          date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          sales: Math.floor(100 + Math.random() * 400)
        });
      }
      break;
  }

  return dataPoints;
};

// Generate top collections
export const generateTopCollections = (timeRange: TimeRangeType): CollectionStat[] => {
  const baseCollections = [
    {
      id: "collection-1",
      name: "Bored Ape Yacht Club",
      thumbnail: "https://images.unsplash.com/photo-1614812513172-567d2fe96a75?q=80&w=100",
    },
    {
      id: "collection-2",
      name: "CryptoPunks",
      thumbnail: "https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=100",
    },
    {
      id: "collection-3",
      name: "Azuki",
      thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=100",
    },
    {
      id: "collection-4",
      name: "Doodles",
      thumbnail: "https://images.unsplash.com/photo-1592492152545-9695d3f473f4?q=80&w=100",
    },
    {
      id: "collection-5",
      name: "CloneX",
      thumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=100",
    },
    {
      id: "collection-6",
      name: "Art Blocks",
      thumbnail: "https://images.unsplash.com/photo-1597176116047-876a32798fcc?q=80&w=100",
    },
    {
      id: "collection-7",
      name: "Moonbirds",
      thumbnail: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=100",
    },
    {
      id: "collection-8",
      name: "Proof Collective",
      thumbnail: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=100",
    },
    {
      id: "collection-9",
      name: "World of Women",
      thumbnail: "https://images.unsplash.com/photo-1633250587605-92d0cad3e0e6?q=80&w=100",
    },
    {
      id: "collection-10",
      name: "Meebits",
      thumbnail: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=100",
    }
  ];

  // Shuffle array for different time ranges
  const shuffledCollections = [...baseCollections];
  
  if (timeRange !== "all") {
    for (let i = shuffledCollections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCollections[i], shuffledCollections[j]] = [shuffledCollections[j], shuffledCollections[i]];
    }
  }

  // Add randomized stats
  return shuffledCollections.map((collection, index) => {
    const baseVolume = 500 - index * 40;
    const randomFactor = timeRange === "24h" ? 0.1 : timeRange === "7d" ? 0.5 : 1;
    
    return {
      ...collection,
      rank: index + 1,
      volume: baseVolume * randomFactor * (1 + Math.random() * 0.5),
      floorPrice: 10 - index * 0.5 * (1 + Math.random() * 0.3),
      owners: Math.floor(5000 - index * 300 * (1 + Math.random() * 0.3)),
      items: Math.floor(10000 - index * 500 * (1 + Math.random() * 0.2)),
      change: index % 3 === 0 ? -Number((Math.random() * 10).toFixed(1)) : Number((Math.random() * 20).toFixed(1))
    };
  }).slice(0, 10);
};
