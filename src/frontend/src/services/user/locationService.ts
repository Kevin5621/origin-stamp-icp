/**
 * Location Service
 * Handles location-related operations using OpenStreetMap Nominatim API
 */

interface LocationOption {
  display_name: string;
  place_id: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

interface LocationSearchParams {
  query: string;
  limit?: number;
  countryCode?: string;
  type?: "city" | "country" | "state";
}

class LocationService {
  private readonly baseUrl = "https://nominatim.openstreetmap.org/search";
  private readonly reverseUrl = "https://nominatim.openstreetmap.org/reverse";

  /**
   * Search for locations using Nominatim API
   */
  async searchLocations(
    params: LocationSearchParams,
  ): Promise<LocationOption[]> {
    const { query, limit = 8, countryCode, type } = params;

    if (query.length < 2) {
      return [];
    }

    try {
      const searchParams = new URLSearchParams({
        format: "json",
        q: query,
        limit: limit.toString(),
        addressdetails: "1",
        extratags: "1",
      });

      if (countryCode) {
        searchParams.append("countrycodes", countryCode);
      }

      if (type) {
        searchParams.append("featuretype", type);
      }

      const response = await fetch(
        `${this.baseUrl}?${searchParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch {
      throw new Error("Failed to search locations");
    }
  }

  /**
   * Get location details by coordinates (reverse geocoding)
   */
  async getLocationByCoordinates(
    lat: number,
    lng: number,
  ): Promise<LocationOption | null> {
    try {
      const params = new URLSearchParams({
        format: "json",
        lat: lat.toString(),
        lon: lng.toString(),
        addressdetails: "1",
      });

      const response = await fetch(`${this.reverseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Get popular cities for quick selection
   */
  async getPopularCities(countryCode?: string): Promise<LocationOption[]> {
    const popularCities = [
      "Jakarta, Indonesia",
      "Surabaya, Indonesia",
      "Bandung, Indonesia",
      "Medan, Indonesia",
      "Semarang, Indonesia",
      "Makassar, Indonesia",
      "Palembang, Indonesia",
      "Tangerang, Indonesia",
      "Depok, Indonesia",
      "Bekasi, Indonesia",
    ];

    const results: LocationOption[] = [];

    for (const city of popularCities) {
      try {
        const locations = await this.searchLocations({
          query: city,
          limit: 1,
          countryCode: countryCode || "ID",
          type: "city",
        });

        if (locations.length > 0) {
          results.push(locations[0]);
        }
      } catch {
        // Continue with other cities if one fails
        continue;
      }
    }

    return results;
  }

  /**
   * Format location name for display
   */
  formatLocationName(location: LocationOption): string {
    const { address } = location;
    if (address) {
      const parts = [];
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
      return parts.join(", ");
    }
    return location.display_name;
  }

  /**
   * Get coordinates from location
   */
  getCoordinates(location: LocationOption): { lat: number; lng: number } {
    return {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
  }

  /**
   * Validate location format
   */
  isValidLocation(location: string): boolean {
    return location.length >= 2 && location.length <= 200;
  }

  /**
   * Get country list for filtering
   */
  async getCountries(): Promise<Array<{ code: string; name: string }>> {
    // Common countries list - in a real app, you might want to fetch this from an API
    return [
      { code: "ID", name: "Indonesia" },
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "SG", name: "Singapore" },
      { code: "MY", name: "Malaysia" },
      { code: "TH", name: "Thailand" },
      { code: "PH", name: "Philippines" },
      { code: "VN", name: "Vietnam" },
      { code: "AU", name: "Australia" },
      { code: "JP", name: "Japan" },
      { code: "KR", name: "South Korea" },
      { code: "CN", name: "China" },
      { code: "IN", name: "India" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "IT", name: "Italy" },
      { code: "ES", name: "Spain" },
      { code: "CA", name: "Canada" },
      { code: "BR", name: "Brazil" },
      { code: "MX", name: "Mexico" },
    ];
  }
}

export const locationService = new LocationService();
export type { LocationOption, LocationSearchParams };
