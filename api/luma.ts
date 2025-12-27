import { VercelRequest, VercelResponse } from "@vercel/node";

export interface LumaEvent {
  id: string;
  platform: "luma";
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
    const { limit = 30 } = req.query;

    // Luma API: https://www.luma.com/
    // Note: Luma doesn't have a public API, so we'll use a workaround
    // by fetching from their public event feed
    const lumaUrl = `https://api.lu.ma/public/events?limit=${limit}&query=AI`;

    const response = await fetch(lumaUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      // Return empty array if Luma is unavailable
      console.warn(`Luma API warning: ${response.statusText}`);
      return res.status(200).json({
        events: [],
        total: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const events: LumaEvent[] = (data.events || []).map((event: any) => ({
      id: `luma-${event.id}`,
      platform: "luma",
      title: event.name,
      description: event.description || "",
      startDate: event.start_at || new Date().toISOString(),
      endDate: event.end_at,
      location: event.location?.name || "Online",
      url: event.url,
      attendees: event.attendee_count,
      capacity: event.capacity,
      imageUrl: event.cover_url,
    }));

    res.status(200).json({
      events,
      total: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Luma error:", error);
    // Return empty array instead of error to allow other platforms to work
    res.status(200).json({
      error: "Failed to fetch Luma events",
      message: error instanceof Error ? error.message : "Unknown error",
      events: [],
    });
  }
}
