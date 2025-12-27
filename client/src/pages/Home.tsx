import { useEffect } from "react";
import { useEventAggregator } from "@/hooks/useEventAggregator";
import SearchFilter from "@/components/SearchFilter";
import EventCard from "@/components/EventCard";
import { Loader2, AlertCircle } from "lucide-react";
import { SearchFilters } from "@/types/event";

/**
 * Home Page - Tech Minimalism Design
 * Clean, efficient interface for searching and discovering AI events
 * across multiple platforms (Connpass, Meetup, Luma)
 */
export default function Home() {
  const { events, isLoading, error, search } = useEventAggregator();

  // Initial search on mount
  useEffect(() => {
    const initialFilters: SearchFilters = {
      keyword: "AI",
      location: "Tokyo",
      platforms: ["connpass", "meetup", "luma"],
    };
    search(initialFilters);
  }, [search]);

  const handleSearch = (filters: SearchFilters) => {
    search(filters);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Event Aggregator</h1>
              <p className="text-sm text-muted-foreground">
                Connpass, Meetup, Lumaからイベントを集約検索
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Search Filter */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <SearchFilter onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </aside>

          {/* Main Content - Event List */}
          <section className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200">
                    エラーが発生しました
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">イベントを検索中...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && events.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  イベントが見つかりませんでした
                </p>
                <p className="text-sm text-muted-foreground">
                  検索条件を変更して試してください
                </p>
              </div>
            )}

            {/* Event Grid */}
            {!isLoading && events.length > 0 && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {events.length} 件のイベントが見つかりました
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 AI Event Aggregator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
