import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { GENRE_COLORS } from "@/lib/constants";

interface SidebarProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  filters: {
    recentlyUpdated: boolean;
    complete: boolean;
    longStories: boolean;
  };
  onFilterChange: (filter: string, value: boolean) => void;
}

export default function Sidebar({ selectedGenre, onGenreChange, filters, onFilterChange }: SidebarProps) {
  const { data: genreStats } = useQuery({
    queryKey: ['/api/stats/genres'],
  });

  const { data: fandomStats } = useQuery({
    queryKey: ['/api/stats/fandoms'],
  });

  const getGenreColor = (genre: string) => {
    return GENRE_COLORS[genre as keyof typeof GENRE_COLORS] || '#6b7280';
  };

  return (
    <aside className="lg:w-64 flex-shrink-0">
      {/* Quick Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Filters</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recently-updated"
              checked={filters.recentlyUpdated}
              onCheckedChange={(checked) => onFilterChange('recentlyUpdated', checked as boolean)}
            />
            <label htmlFor="recently-updated" className="text-sm text-gray-700">
              Recently Updated
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="complete"
              checked={filters.complete}
              onCheckedChange={(checked) => onFilterChange('complete', checked as boolean)}
            />
            <label htmlFor="complete" className="text-sm text-gray-700">
              Complete
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="long-stories"
              checked={filters.longStories}
              onCheckedChange={(checked) => onFilterChange('longStories', checked as boolean)}
            />
            <label htmlFor="long-stories" className="text-sm text-gray-700">
              Long (50k+ words)
            </label>
          </div>
        </div>
      </div>

      {/* Popular Genres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Genres</h3>
        <div className="space-y-2">
          {genreStats?.map((stat) => (
            <button
              key={stat.genre}
              onClick={() => onGenreChange(selectedGenre === stat.genre ? '' : stat.genre)}
              className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 ${
                selectedGenre === stat.genre ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getGenreColor(stat.genre) }}
                />
                <span className="text-sm text-gray-700">{stat.genre}</span>
              </div>
              <span className="text-xs text-gray-500">{stat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Fandoms */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Trending Fandoms</h3>
        <div className="space-y-2">
          {fandomStats?.slice(0, 5).map((stat) => (
            <a
              key={stat.fandom}
              href="#"
              className="block p-2 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm text-gray-700">{stat.fandom}</span>
              <div className="text-xs text-gray-500">{stat.count} stories</div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
