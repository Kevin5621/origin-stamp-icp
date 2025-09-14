import React from "react";
import { CheckCircle } from "lucide-react";

export const HeroBanner: React.FC = () => {
  const collectionData = {
    name: "Lil Pudgys",
    creator: "By TheIglooCompany",
    verified: true,
    stats: {
      floorPrice: "1.265 ETH",
      items: "21,916",
      totalVolume: "131.9K ETH",
      listed: "3%",
    },
    thumbnails: [
      { id: 1, src: "/placeholder-pudgy-1.png", alt: "Pudgy 1" },
      { id: 2, src: "/placeholder-pudgy-2.png", alt: "Pudgy 2" },
      { id: 3, src: "/placeholder-pudgy-3.png", alt: "Pudgy 3" },
    ],
  };

  return (
    <div className="relative mb-8 h-[400px] overflow-hidden rounded-xl">
      {/* Background Image - Placeholder for the actual Lil Pudgys collage */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500">
        {/* Pattern overlay to simulate the penguin collage */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid h-full grid-cols-8 grid-rows-6">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-4xl"
                style={{
                  transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`,
                }}
              >
                🐧
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Content Overlay - No central container */}
      <div className="relative z-10 flex h-full items-end justify-between p-8">
        {/* Left: Collection Info and Stats */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-white">
              {collectionData.name}
            </h2>
            {collectionData.verified && (
              <CheckCircle className="h-8 w-8 text-blue-400" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl text-white/90">
              {collectionData.creator}
            </span>
            {collectionData.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>

          {/* Stats Box */}
          <div className="mt-4 rounded-lg bg-black/60 p-4 text-white backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white/70">
                  FLOOR PRICE
                </span>
                <span className="text-xl font-bold">
                  {collectionData.stats.floorPrice}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white/70">ITEMS</span>
                <span className="text-xl font-bold">
                  {collectionData.stats.items}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white/70">
                  TOTAL VOLUME
                </span>
                <span className="text-xl font-bold">
                  {collectionData.stats.totalVolume}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white/70">
                  LISTED
                </span>
                <span className="text-xl font-bold">
                  {collectionData.stats.listed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Thumbnails */}
        <div className="flex items-end gap-3">
          {collectionData.thumbnails.map((thumb, index) => (
            <div
              key={thumb.id}
              className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-white shadow-xl"
              style={{
                marginBottom: `${index * 8}px`,
                transform: `rotate(${(index - 1) * 5}deg)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-300 text-4xl">
                🐧
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`h-2 w-8 rounded-full transition-all duration-200 ${
              dot === 1 ? "bg-white" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
