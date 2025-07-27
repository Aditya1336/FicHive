import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List } from "lucide-react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StoryCard from "@/components/story-card";
import MobileNav from "@/components/mobile-nav";
import ReadingModal from "@/components/reading-modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SORT_OPTIONS } from "@/lib/constants";
import type { Story } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'newest' | 'wordCount'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    recentlyUpdated: false,
    complete: false,
    longStories: false,
  });
  
  // Reading modal state
  const [readingStory, setReadingStory] = useState<Story | null>(null);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (selectedGenre) params.genre = selectedGenre;
    if (sortBy) params.sortBy = sortBy;
    if (searchQuery) params.search = searchQuery;
    return params;
  }, [selectedGenre, sortBy, searchQuery]);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['/api/stories', queryParams],
  });

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    
    let filtered = [...stories];
    
    if (filters.complete) {
      filtered = filtered.filter(story => story.isComplete);
    }
    
    if (filters.longStories) {
      filtered = filtered.filter(story => story.wordCount >= 50000);
    }
    
    if (filters.recentlyUpdated) {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(story => new Date(story.lastUpdated) > threeDaysAgo);
    }
    
    return filtered;
  }, [stories, filters]);

  const handleFilterChange = (filter: string, value: boolean) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const handleStoryClick = (story: Story) => {
    setReadingStory(story);
    setIsReadingModalOpen(true);
  };

  const featuredStory = stories?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <main className="flex-1">
            {/* Featured Story Banner */}
            {featuredStory && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 mb-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={featuredStory.coverImage}
                      alt={`${featuredStory.title} cover`}
                      className="w-32 h-44 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="bg-white/20 text-white border-white/20 mb-2">
                      Featured Story
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">{featuredStory.title}</h2>
                    <p className="text-white/90 mb-4 line-clamp-3">{featuredStory.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center">
                        <span className="mr-1">❤️</span>
                        {featuredStory.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {featuredStory.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🕐</span>
                        Last updated{" "}
                        {Math.floor((Date.now() - new Date(featuredStory.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        days ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sorting and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Latest Stories</h2>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={(value: 'recent' | 'popular' | 'newest' | 'wordCount') => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        Sort by: {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex border border-gray-300 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Story Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStories.length > 0 ? (
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Load More Button */}
            {filteredStories.length > 0 && (
              <div className="text-center">
                <Button variant="outline" className="px-6 py-3">
                  Load More Stories
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <ReadingModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        story={readingStory}
      />
      
      <MobileNav />
    </div>
  );
}
