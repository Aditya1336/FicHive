import { type Story, type InsertStory, type Chapter, type InsertChapter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Stories
  getStories(options?: {
    genre?: string;
    fandom?: string;
    sortBy?: 'recent' | 'popular' | 'newest' | 'wordCount';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Story[]>;
  getStory(id: string): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryViews(id: string): Promise<void>;
  updateStoryLikes(id: string, increment: boolean): Promise<void>;
  
  // Chapters
  getChaptersByStoryId(storyId: string): Promise<Chapter[]>;
  getChapter(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  
  // Stats
  getGenreStats(): Promise<Array<{ genre: string; count: number }>>;
  getFandomStats(): Promise<Array<{ fandom: string; count: number }>>;
}

export class MemStorage implements IStorage {
  private stories: Map<string, Story>;
  private chapters: Map<string, Chapter>;

  constructor() {
    this.stories = new Map();
    this.chapters = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed with initial stories
    const seedStories: Array<Omit<Story, 'id'>> = [
      {
        title: "The Enchanted Academy",
        description: "A captivating tale of magic, friendship, and discovery in a hidden world where nothing is as it seems...",
        author: "moonwriter",
        genre: "Fantasy",
        fandom: "Harry Potter",
        wordCount: 124000,
        chapterCount: 24,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 1240,
        views: 8920,
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        tags: ["magic", "friendship", "adventure", "school"]
      },
      {
        title: "Moonlight Confessions",
        description: "When Sarah returns to her hometown, she never expected to find her childhood friend has become the town's most eligible bachelor...",
        author: "romanticwriter",
        genre: "Romance",
        fandom: "Original Fiction",
        wordCount: 45200,
        chapterCount: 12,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 892,
        views: 12400,
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["romance", "hometown", "second-chance", "small-town"]
      },
      {
        title: "The Dragon's Apprentice",
        description: "In a world where magic is forbidden, young Elara discovers she has the power to communicate with dragons...",
        author: "fantasylover",
        genre: "Fantasy",
        fandom: "Dragon Age",
        wordCount: 78900,
        chapterCount: 18,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 1200,
        views: 18700,
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["dragons", "magic", "forbidden", "coming-of-age"]
      },
      {
        title: "The Missing Manuscript",
        description: "Detective Carter's latest case involves a famous author whose manuscript has disappeared under mysterious circumstances...",
        author: "mysterymaker",
        genre: "Mystery",
        fandom: "Sherlock Holmes",
        wordCount: 32100,
        chapterCount: 8,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 567,
        views: 8900,
        coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["detective", "mystery", "manuscript", "investigation"]
      },
      {
        title: "Beyond the Summit",
        description: "Three friends embark on the journey of a lifetime, climbing the world's most dangerous peak to fulfill a promise...",
        author: "peakclimber",
        genre: "Adventure",
        fandom: "Original Fiction",
        wordCount: 95600,
        chapterCount: 22,
        isComplete: true,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        likes: 2100,
        views: 34500,
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["adventure", "friendship", "mountain-climbing", "promise"]
      },
      {
        title: "Stellar Echoes",
        description: "Captain Nova receives a mysterious signal from the edge of known space, leading her crew into uncharted territory...",
        author: "starwriter",
        genre: "Sci-Fi",
        fandom: "Star Trek",
        wordCount: 67300,
        chapterCount: 15,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 945,
        views: 15200,
        coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["space", "exploration", "mystery", "crew"]
      },
      {
        title: "Shattered Glass",
        description: "A family's perfect facade begins to crumble when long-buried secrets start to surface during a reunion...",
        author: "dramaqueen",
        genre: "Drama",
        fandom: "Original Fiction",
        wordCount: 54800,
        chapterCount: 11,
        isComplete: false,
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 723,
        views: 11600,
        coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        tags: ["family", "secrets", "drama", "reunion"]
      }
    ];

    seedStories.forEach((storyData) => {
      const id = randomUUID();
      const story: Story = { ...storyData, id };
      this.stories.set(id, story);

      // Add a sample chapter for each story
      const chapterId = randomUUID();
      const chapter: Chapter = {
        id: chapterId,
        storyId: id,
        title: "Chapter 1: The Beginning",
        content: `The morning mist clung to the ancient stones like secrets whispered between generations. ${story.author}'s masterpiece begins here, drawing readers into a world of ${story.genre.toLowerCase()} and wonder.

This is the opening chapter of "${story.title}", where our journey truly begins. The author has crafted a compelling narrative that will keep you turning pages late into the night.

As you read further, you'll discover the intricate plot threads that weave together to create this unforgettable story. Each chapter builds upon the last, creating a rich tapestry of characters and events that will stay with you long after you've finished reading.

The story continues to unfold with each passing page, revealing new depths and complexities that make this tale truly special. Whether you're a long-time fan of ${story.fandom} or new to the genre, this story offers something for everyone.

Join us on this incredible journey as we explore themes of love, loss, adventure, and discovery. The author's unique voice shines through every sentence, creating an immersive experience that transports you directly into the heart of the story.`,
        chapterNumber: 1,
        wordCount: 1200,
        createdAt: story.lastUpdated,
      };
      this.chapters.set(chapterId, chapter);
    });
  }

  async getStories(options: {
    genre?: string;
    fandom?: string;
    sortBy?: 'recent' | 'popular' | 'newest' | 'wordCount';
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Story[]> {
    let stories = Array.from(this.stories.values());

    // Apply filters
    if (options.genre) {
      stories = stories.filter(story => story.genre.toLowerCase() === options.genre?.toLowerCase());
    }

    if (options.fandom) {
      stories = stories.filter(story => story.fandom.toLowerCase() === options.fandom?.toLowerCase());
    }

    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      stories = stories.filter(story => 
        story.title.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm) ||
        story.author.toLowerCase().includes(searchTerm) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    switch (options.sortBy) {
      case 'popular':
        stories.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
        stories.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        break;
      case 'wordCount':
        stories.sort((a, b) => b.wordCount - a.wordCount);
        break;
      case 'recent':
      default:
        stories.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        break;
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    return stories.slice(offset, offset + limit);
  }

  async getStory(id: string): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      ...insertStory,
      id,
      lastUpdated: new Date(),
      likes: 0,
      views: 0,
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStoryViews(id: string): Promise<void> {
    const story = this.stories.get(id);
    if (story) {
      story.views += 1;
      this.stories.set(id, story);
    }
  }

  async updateStoryLikes(id: string, increment: boolean): Promise<void> {
    const story = this.stories.get(id);
    if (story) {
      story.likes += increment ? 1 : -1;
      this.stories.set(id, story);
    }
  }

  async getChaptersByStoryId(storyId: string): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .filter(chapter => chapter.storyId === storyId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  async getChapter(id: string): Promise<Chapter | undefined> {
    return this.chapters.get(id);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const id = randomUUID();
    const chapter: Chapter = {
      ...insertChapter,
      id,
      createdAt: new Date(),
    };
    this.chapters.set(id, chapter);
    return chapter;
  }

  async getGenreStats(): Promise<Array<{ genre: string; count: number }>> {
    const genreCounts = new Map<string, number>();
    
    Array.from(this.stories.values()).forEach(story => {
      const current = genreCounts.get(story.genre) || 0;
      genreCounts.set(story.genre, current + 1);
    });

    return Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getFandomStats(): Promise<Array<{ fandom: string; count: number }>> {
    const fandomCounts = new Map<string, number>();
    
    Array.from(this.stories.values()).forEach(story => {
      const current = fandomCounts.get(story.fandom) || 0;
      fandomCounts.set(story.fandom, current + 1);
    });

    return Array.from(fandomCounts.entries())
      .map(([fandom, count]) => ({ fandom, count }))
      .sort((a, b) => b.count - a.count);
  }
}

export const storage = new MemStorage();
