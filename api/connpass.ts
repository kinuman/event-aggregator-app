import { VercelRequest, VercelResponse } from "@vercel/node";

export interface ConnpassEvent {
  id: string;
  platform: "connpass";
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
    const { keyword = "AI", limit = 30 } = req.query;

    // Connpass API: https://connpass.com/about/api/
    const connpassUrl = `https://connpass.com/api/v1/event/?keyword=${keyword}&count=${limit}&order=updated`;

    const response = await fetch(connpassUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    
    if (!response.ok) {
      console.warn(`Connpass API warning: ${response.status} ${response.statusText}`);
      return res.status(200).json({
        events: [],
        total: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const events: ConnpassEvent[] = (data.events || []).map((event: any) => ({
      id: `connpass-${event.event_id}`,
      platform: "connpass",
      title: event.title,
      description: event.description || "",
      startDate: event.started_at || new Date().toISOString(),
      endDate: event.ended_at,
      location: event.place || "Online",
      url: event.event_url,
      attendees: event.accepted,
      capacity: event.limit,
      imageUrl: event.logo_url,
    }));

    res.status(200).json({
      events,
      total: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Connpass error:", error);
    res.status(200).json({
      error: "Failed to fetch Connpass events",
      message: error instanceof Error ? error.message : "Unknown error",
      events: [],
    });
  }
}
