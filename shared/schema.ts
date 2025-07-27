import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  fandom: text("fandom").notNull(),
  wordCount: integer("word_count").notNull(),
  chapterCount: integer("chapter_count").notNull(),
  isComplete: boolean("is_complete").notNull().default(false),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  coverImage: text("cover_image").notNull(),
  tags: text("tags").array().notNull().default([]),
});

export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull().references(() => stories.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  wordCount: integer("word_count").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  lastUpdated: true,
  likes: true,
  views: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
