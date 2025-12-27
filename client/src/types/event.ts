export interface AggregatedEvent {
  id: string;
  platform: "connpass" | "meetup" | "luma";
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url: string;
  attendees?: number;
  capacity?: number;
  imageUrl?: string;
}

export interface SearchFilters {
  keyword: string;
  location: string;
  startDate?: string;
  endDate?: string;
  platforms: ("connpass" | "meetup" | "luma")[];
}
