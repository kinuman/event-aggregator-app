import { VercelRequest, VercelResponse } from "@vercel/node";

export interface MeetupEvent {
  id: string;
  platform: "meetup";
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { location = "Tokyo", limit = 30 } = req.query;

    // Meetup API: https://www.meetup.com/api/
    // Note: Using public events endpoint (no authentication required)
    const meetupUrl = `https://www.meetup.com/api/3/find/events?location=${location}&text=AI&page=${limit}`;

    const response = await fetch(meetupUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.warn(`Meetup API warning: ${response.status} ${response.statusText}`);
      return res.status(200).json({
        events: [],
        total: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const events: MeetupEvent[] = (data || []).map((event: any) => ({
      id: `meetup-${event.id}`,
      platform: "meetup",
      title: event.name,
      description: event.description || "",
      startDate: new Date(event.time).toISOString(),
      location: event.venue?.name || "Online",
      url: event.link,
      attendees: event.yes_rsvp_count,
      capacity: event.rsvp_limit,
      imageUrl: event.featured_photo?.photo_link,
    }));

    res.status(200).json({
      events,
      total: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Meetup error:", error);
    res.status(200).json({
      error: "Failed to fetch Meetup events",
      message: error instanceof Error ? error.message : "Unknown error",
      events: [],
    });
  }
}
