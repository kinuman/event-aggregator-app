import { VercelRequest, VercelResponse } from "@vercel/node";

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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { keyword = "AI", location = "Tokyo", limit = 30 } = req.query;

    // Build base URL for API calls
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3001";

    // Fetch from all platforms in parallel
    const [connpassRes, meetupRes, lumaRes] = await Promise.allSettled([
      fetch(
        `${baseUrl}/api/connpass?keyword=${keyword}&limit=${limit}`
      ),
      fetch(
        `${baseUrl}/api/meetup?location=${location}&limit=${limit}`
      ),
      fetch(
        `${baseUrl}/api/luma?limit=${limit}`
      ),
    ]);

    const events: AggregatedEvent[] = [];

    // Process Connpass results
    if (connpassRes.status === "fulfilled" && connpassRes.value.ok) {
      try {
        const data = await connpassRes.value.json();
        events.push(...(data.events || []));
      } catch (e) {
        console.error("Error parsing Connpass response:", e);
      }
    }

    // Process Meetup results
    if (meetupRes.status === "fulfilled" && meetupRes.value.ok) {
      try {
        const data = await meetupRes.value.json();
        events.push(...(data.events || []));
      } catch (e) {
        console.error("Error parsing Meetup response:", e);
      }
    }

    // Process Luma results
    if (lumaRes.status === "fulfilled" && lumaRes.value.ok) {
      try {
        const data = await lumaRes.value.json();
        events.push(...(data.events || []));
      } catch (e) {
        console.error("Error parsing Luma response:", e);
      }
    }

    // Sort by start date
    events.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    res.status(200).json({
      total: events.length,
      events: events.slice(0, parseInt(String(limit))),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({
      error: "Failed to aggregate events",
      message: error instanceof Error ? error.message : "Unknown error",
      events: [],
      total: 0,
    });
  }
}
