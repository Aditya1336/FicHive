import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Eye, Clock, BookOpen, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ReadingModal from "@/components/reading-modal";
import MobileNav from "@/components/mobile-nav";
import { GENRE_COLORS } from "@/lib/constants";

export default function Story() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  const { data: story, isLoading: storyLoading } = useQuery({
    queryKey: ['/api/stories', id],
    enabled: !!id,
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['/api/stories', id, 'chapters'],
    enabled: !!id,
  });

  const getGenreClass = (genre: string) => {
    const genreClasses = {
      'Romance': 'bg-red-500',
      'Fantasy': 'bg-emerald-600',
      'Adventure': 'bg-amber-500',
      'Mystery': 'bg-violet-500',
      'Sci-Fi': 'bg-cyan-500',
      'Drama': 'bg-orange-500',
    };
    return genreClasses[genre as keyof typeof genreClasses] || 'bg-gray-500';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const handleStartReading = () => {
    setSelectedChapterIndex(0);
    setIsReadingModalOpen(true);
  };

  const handleChapterClick = (chapterIndex: number) => {
    setSelectedChapterIndex(chapterIndex);
    setIsReadingModalOpen(true);
  };

  if (storyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-80 h-96 rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Story not found</p>
          <Button onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Story Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            <img
              src={story.coverImage}
              alt={`${story.title} cover`}
              className="w-full md:w-80 h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Story Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <Badge className={`${getGenreClass(story.genre)} text-white`}>
                {story.genre}
              </Badge>
              {story.isComplete && (
                <Badge className="bg-green-500 text-white">Complete</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">by</span>
              <span className="text-blue-600 font-medium">@{story.author}</span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {story.description}
            </p>

            {/* Story Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <Heart className="w-5 h-5 mx-auto mb-1 text-red-500" />
                <div className="font-semibold">{story.likes.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <Eye className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                <div className="font-semibold">{story.views.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                <div className="font-semibold">{story.chapterCount}</div>
                <div className="text-sm text-gray-600">Chapters</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                <div className="font-semibold">{Math.floor(story.wordCount / 1000)}k</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
            </div>

            {/* Tags */}
            {story.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleStartReading} size="lg" className="flex-1 md:flex-none">
                <BookOpen className="w-4 h-4 mr-2" />
                Start Reading
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
            </div>
          </div>
        </div>

        {/* Story Details */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Chapters List */}
            <Card>
              <CardHeader>
                <CardTitle>Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                {chaptersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : chapters && chapters.length > 0 ? (
                  <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterClick(index)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {chapter.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {chapter.wordCount.toLocaleString()} words
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatTimeAgo(new Date(chapter.createdAt))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No chapters available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Story Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Story Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-900">Fandom:</span>
                  <p className="text-sm text-gray-600">{story.fandom}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium text-gray-900">Word Count:</span>
                  <p className="text-sm text-gray-600">{story.wordCount.toLocaleString()} words</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium text-gray-900">Status:</span>
                  <p className="text-sm text-gray-600">
                    {story.isComplete ? 'Complete' : 'In Progress'}
                  </p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium text-gray-900">Last Updated:</span>
                  <p className="text-sm text-gray-600">
                    {formatTimeAgo(new Date(story.lastUpdated))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ReadingModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        story={story}
        initialChapterIndex={selectedChapterIndex}
      />

      <MobileNav />
    </div>
  );
}
