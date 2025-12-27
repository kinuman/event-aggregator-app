import { useState, useCallback } from "react";
import { AggregatedEvent, SearchFilters } from "@/types/event";

interface UseEventAggregatorReturn {
  events: AggregatedEvent[];
  isLoading: boolean;
  error: string | null;
  search: (filters: SearchFilters) => Promise<void>;
}

export function useEventAggregator(): UseEventAggregatorReturn {
  const [events, setEvents] = useState<AggregatedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        keyword: filters.keyword,
        location: filters.location,
        limit: "30",
      });

      const response = await fetch(`/api/aggregate?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      // Filter by selected platforms
      const filteredEvents = (data.events || []).filter((event: AggregatedEvent) =>
        filters.platforms.includes(event.platform)
      );

      setEvents(filteredEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    events,
    isLoading,
    error,
    search,
  };
}
