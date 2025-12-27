import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { AggregatedEvent } from "@/types/event";

interface EventCardProps {
  event: AggregatedEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const platformColors = {
    connpass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    meetup: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    luma: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  };

  const platformLabels = {
    connpass: "Connpass",
    meetup: "Meetup",
    luma: "Luma",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block bg-card text-card-foreground rounded-lg border border-border p-4 transition-all duration-200"
    >
      {/* Platform Badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${platformColors[event.platform]}`}
        >
          {platformLabels[event.platform]}
        </span>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="mb-3 -mx-4 -mt-4 h-32 bg-gradient-to-b from-muted to-transparent overflow-hidden rounded-t-lg">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-base line-clamp-2 mb-2 hover:text-primary transition-colors">
        {event.title}
      </h3>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Calendar className="w-4 h-4" />
        <time>{formatDate(event.startDate)}</time>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <MapPin className="w-4 h-4" />
        <span className="line-clamp-1">{event.location}</span>
      </div>

      {/* Attendees */}
      {event.attendees !== undefined && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {event.attendees} 人
            {event.capacity && ` / ${event.capacity}`}
          </span>
        </div>
      )}

      {/* Description Preview */}
      {event.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-3">
          {event.description.replace(/<[^>]*>/g, "")}
        </p>
      )}
    </a>
  );
}
