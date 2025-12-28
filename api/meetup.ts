import { VercelRequest, VercelResponse } from "@vercel/node";
import { AggregatedEvent } from "./aggregate";

// --- IMPORTANT NOTE ON MEETUP API ---
// Meetup has deprecated its legacy API and now primarily uses a GraphQL API
// which requires OAuth 2.0 authentication. The endpoint used below is
// highly unreliable and may stop working at any time.
//
// For a robust solution, you must refactor this file to:
// 1. Implement an OAuth 2.0 flow to get an access token.
// 2. Use the modern GraphQL API endpoint with the access token.
// ------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { location = "Tokyo", limit = 30 } = req.query;

    // Legacy Meetup API endpoint - use with caution
    const meetupUrl = `https://www.meetup.com/api/3/find/events?location=${location}&text=AI&page=${limit}`;

    console.log(`Fetching Meetup events from legacy endpoint: ${meetupUrl}` );

    const response = await fetch(meetupUrl, {
      headers: {
        "Accept": "application/json",
        // Use a more descriptive User-Agent
        "User-Agent": "EventAggregatorApp/1.0 (Contact: user@example.com)",
      },
    });

    if (!response.ok) {
      console.error(`Meetup API Error: ${response.status} ${response.statusText}`);
      // Return a 200 with empty data to allow aggregation to continue
      return res.status(200).json({
        events: [],
        total: 0,
        warning: `Meetup API failed with status ${response.status}. This is likely due to the deprecated endpoint. Refactor to use GraphQL/OAuth.`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const events: AggregatedEvent[] = (data || []).map((event: any) => ({
      id: `meetup-${event.id}`,
      platform: "meetup",
      title: event.name,
      description: event.description || "",
      startDate: new Date(event.time).toISOString(),
      endDate: event.time + event.duration ? new Date(event.time + event.duration).toISOString() : undefined,
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
