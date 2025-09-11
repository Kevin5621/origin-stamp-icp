import { useState, useEffect, useRef } from "react";
import { locationService, type LocationOption } from "@/services/user";

interface UseLocationSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  limit?: number;
}

export const useLocationSearch = (options: UseLocationSearchOptions = {}) => {
  const { debounceMs = 300, minQueryLength = 2, limit = 8 } = options;

  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocations = async (query: string) => {
    if (query.length < minQueryLength) {
      setLocations([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await locationService.searchLocations({
        query,
        limit,
      });
      setLocations(data);
    } catch {
      setError("Failed to load locations");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(query);
    }, debounceMs);
  };

  const clearResults = () => {
    setLocations([]);
    setError(null);
    setLoading(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    locations,
    loading,
    error,
    searchLocations: debouncedSearch,
    clearResults,
  };
};

// Utility function to format location names
export const formatLocationName = (location: LocationOption): string => {
  const { address } = location;
  if (address) {
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    return parts.join(", ");
  }
  return location.display_name;
};

// Utility function to get location coordinates
export const getLocationCoordinates = (location: LocationOption) => {
  return {
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
  };
};
