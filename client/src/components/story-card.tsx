import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { GENRE_COLORS } from "@/lib/constants";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(story.likes);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async ({ increment }: { increment: boolean }) => {
      await apiRequest('POST', `/api/stories/${story.id}/like`, { increment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update story like",
        variant: "destructive",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
    likeMutation.mutate({ increment: newIsLiked });
  };

  const handleCardClick = () => {
    setLocation(`/story/${story.id}`);
  };

  const getGenreColor = (genre: string) => {
    return GENRE_COLORS[genre as keyof typeof GENRE_COLORS] || '#6b7280';
  };

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

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="aspect-[3/4] relative" onClick={handleCardClick}>
        <img
          src={story.coverImage}
          alt={`${story.title} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getGenreClass(story.genre)} text-white text-xs font-medium`}>
            {story.genre}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full h-auto w-auto"
            onClick={handleLike}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </Button>
        </div>
        {story.isComplete && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-500 text-white text-xs font-medium">
              Complete
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4" onClick={handleCardClick}>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{story.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{story.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            by{" "}
            <span className="text-blue-600 hover:underline">@{story.author}</span>
          </span>
          <span>{story.wordCount.toLocaleString()} words</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1 text-red-500" />
              {likes}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {story.views.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(new Date(story.lastUpdated))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
