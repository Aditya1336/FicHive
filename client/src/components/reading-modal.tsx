import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, Type, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Story, Chapter } from "@shared/schema";

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  initialChapterIndex?: number;
}

export default function ReadingModal({ isOpen, onClose, story, initialChapterIndex = 0 }: ReadingModalProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['/api/stories', story?.id, 'chapters'],
    enabled: !!story?.id && isOpen,
  });

  const currentChapter = chapters?.[currentChapterIndex];

  const { data: chapterContent, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/chapters', currentChapter?.id],
    enabled: !!currentChapter?.id,
  });

  useEffect(() => {
    setCurrentChapterIndex(initialChapterIndex);
  }, [initialChapterIndex, story]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapters && currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const getProgressPercentage = () => {
    if (!chapters || chapters.length === 0) return 0;
    return ((currentChapterIndex + 1) / chapters.length) * 100;
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full h-full max-h-[90vh] flex flex-col">
          {/* Reading Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">{story.title}</h2>
                {currentChapter && (
                  <p className="text-sm text-gray-600">{currentChapter.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" title="Bookmark">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Text Size">
                <Type className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} title="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reading Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-8">
              {contentLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : chapterContent ? (
                <div className="reading-content">
                  {chapterContent.content.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Chapter content not available
                </div>
              )}
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Chapter
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Chapter {currentChapterIndex + 1} of {chapters?.length || 0}
                </span>
                <div className="w-32">
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleNextChapter}
                disabled={!chapters || currentChapterIndex >= chapters.length - 1}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                Next Chapter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
