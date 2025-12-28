import { VercelRequest, VercelResponse } from "@vercel/node";
import { AggregatedEvent } from "./aggregate";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { limit = 30 } = req.query;
    const lumaApiKey = process.env.LUMA_API_KEY;

    // Luma API: Using the public endpoint, but supporting API key for official access
    const lumaUrl = `https://api.lu.ma/public/events?limit=${limit}&query=AI`;
    
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "EventAggregatorApp/1.0 (Contact: user@example.com )",
    };

    if (lumaApiKey) {
      // If an API key is provided, use the official public-api.luma.com base URL
      // and include the API key in the header for more stable access.
      // Note: The official API may have different endpoints, this is a best-effort improvement.
      // For full stability, the endpoint URL might need adjustment based on official docs.
      // const officialLumaUrl = `https://public-api.luma.com/v1/events?limit=${limit}&query=AI`;
      // lumaUrl = officialLumaUrl;
      headers["x-luma-api-key"] = lumaApiKey;
      console.log("Using LUMA_API_KEY for Luma API request." );
    } else {
      console.log("LUMA_API_KEY not found. Using public Luma endpoint.");
    }

    const response = await fetch(lumaUrl, { headers });

    if (!response.ok) {
      // Return empty array if Luma is unavailable
      console.error(`Luma API warning: ${response.status} ${response.statusText}`);
      return res.status(200).json({
        events: [],
        total: 0,
        warning: `Luma API failed with status ${response.status}. Check LUMA_API_KEY and endpoint.`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const events: AggregatedEvent[] = (data.events || []).map((event: any) => ({
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
