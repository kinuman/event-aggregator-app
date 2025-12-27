import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { SearchFilters } from "@/types/event";

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export default function SearchFilter({ onSearch, isLoading }: SearchFilterProps) {
  const [keyword, setKeyword] = useState("AI");
  const [location, setLocation] = useState("Tokyo");
  const [platforms, setPlatforms] = useState<("connpass" | "meetup" | "luma")[]>([
    "connpass",
    "meetup",
    "luma",
  ]);

  const handlePlatformChange = (platform: "connpass" | "meetup" | "luma") => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSearch = () => {
    onSearch({
      keyword,
      location,
      platforms,
    });
  };

  const handleReset = () => {
    setKeyword("AI");
    setLocation("Tokyo");
    setPlatforms(["connpass", "meetup", "luma"]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">イベント検索</h2>
      </div>

      {/* Keyword Input */}
      <div className="space-y-2">
        <Label htmlFor="keyword" className="text-sm font-medium">
          キーワード
        </Label>
        <Input
          id="keyword"
          type="text"
          placeholder="AI, 機械学習, etc..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
        />
      </div>

      {/* Location Input */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          地域
        </Label>
        <Input
          id="location"
          type="text"
          placeholder="東京, 大阪, etc..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
        />
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">プラットフォーム</Label>
        <div className="space-y-2">
          {(["connpass", "meetup", "luma"] as const).map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              <Checkbox
                id={platform}
                checked={platforms.includes(platform)}
                onCheckedChange={() => handlePlatformChange(platform)}
              />
              <Label
                htmlFor={platform}
                className="text-sm font-normal cursor-pointer"
              >
                {platform === "connpass" && "Connpass"}
                {platform === "meetup" && "Meetup"}
                {platform === "luma" && "Luma"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSearch}
          disabled={isLoading || platforms.length === 0}
          className="flex-1 gap-2"
        >
          <Search className="w-4 h-4" />
          検索
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 gap-2"
        >
          <X className="w-4 h-4" />
          リセット
        </Button>
      </div>
    </div>
  );
}
