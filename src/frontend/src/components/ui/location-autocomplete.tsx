import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { locationService, type LocationOption } from "@/services/user";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await locationService.searchLocations({
        query,
        limit: 8,
      });
      setLocations(data);
    } catch {
      setError("Failed to load locations");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelect = (location: LocationOption) => {
    const displayName = location.display_name;
    onChange(displayName);
    setSearchQuery(displayName);
    setOpen(false);
  };

  const formatLocationName = (location: LocationOption) => {
    return locationService.formatLocationName(location);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <span className="truncate">
              {value || searchQuery || placeholder}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background w-full border p-0 shadow-lg"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList className="bg-background">
            {loading && (
              <div className="bg-background flex items-center justify-center py-6">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Searching locations...
                </span>
              </div>
            )}
            {error && (
              <div className="bg-background flex items-center justify-center py-6">
                <span className="text-destructive text-sm">{error}</span>
              </div>
            )}
            {!loading && !error && locations.length === 0 && searchQuery && (
              <CommandEmpty className="bg-background">
                No locations found.
              </CommandEmpty>
            )}
            {!loading && !error && locations.length > 0 && (
              <CommandGroup className="bg-background">
                {locations.map((location) => (
                  <CommandItem
                    key={location.place_id}
                    value={location.display_name}
                    onSelect={() => handleSelect(location)}
                    className="bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatLocationName(location)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {location.display_name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Alternative: Simple input with suggestions (lighter weight)
export const LocationInput: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter your location...",
  className,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const data = await locationService.searchLocations({
        query,
        limit: 5,
      });
      setSuggestions(data);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const handleSelect = (location: LocationOption) => {
    onChange(location.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          disabled={disabled}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        />
        {loading && (
          <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-background text-foreground absolute z-50 mt-1 w-full rounded-md border p-1 shadow-lg">
          {suggestions.map((location) => (
            <div
              key={location.place_id}
              className="bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm px-2 py-1.5 text-sm"
              onClick={() => handleSelect(location)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-3 w-3" />
                <span className="truncate">{location.display_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
