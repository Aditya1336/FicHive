import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get stories with optional filtering and sorting
  app.get("/api/stories", async (req, res) => {
    try {
      const { genre, fandom, sortBy, search, limit, offset } = req.query;
      
      const stories = await storage.getStories({
        genre: genre as string,
        fandom: fandom as string,
        sortBy: sortBy as 'recent' | 'popular' | 'newest' | 'wordCount',
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  // Get a specific story
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStory(req.params.id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      // Increment view count
      await storage.updateStoryViews(req.params.id);
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  // Get chapters for a story
  app.get("/api/stories/:id/chapters", async (req, res) => {
    try {
      const chapters = await storage.getChaptersByStoryId(req.params.id);
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  // Get a specific chapter
  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapter" });
    }
  });

  // Like/unlike a story
  app.post("/api/stories/:id/like", async (req, res) => {
    try {
      const { increment } = req.body;
      await storage.updateStoryLikes(req.params.id, increment);
      res.json({ message: "Story like updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update story like" });
    }
  });

  // Get genre statistics
  app.get("/api/stats/genres", async (req, res) => {
    try {
      const stats = await storage.getGenreStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch genre stats" });
    }
  });

  // Get fandom statistics
  app.get("/api/stats/fandoms", async (req, res) => {
    try {
      const stats = await storage.getFandomStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fandom stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
