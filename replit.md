# FictionVault - Story Reading Platform

## Overview

FictionVault is a full-stack web application for browsing and reading fictional stories. It provides a modern, responsive interface for users to discover stories by genre, fandom, and other filters, with an immersive reading experience. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: Neon Database (PostgreSQL)
- **API**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Built application output
```

## Key Components

### Database Schema
The application uses two main entities defined in `shared/schema.ts`:

1. **Stories Table**
   - Basic story metadata (title, description, author)
   - Content categorization (genre, fandom, tags)
   - Engagement metrics (likes, views, word count)
   - Completion status and timestamps

2. **Chapters Table**
   - Individual story chapters with content
   - Chapter ordering and metadata
   - Word count tracking per chapter

### API Endpoints
- `GET /api/stories` - Browse stories with filtering and sorting
- `GET /api/stories/:id` - Get specific story details
- `GET /api/stories/:id/chapters` - Get chapters for a story
- `POST /api/stories/:id/like` - Like/unlike a story
- `GET /api/stats/genres` - Genre statistics
- `GET /api/stats/fandoms` - Fandom statistics

### Frontend Features
- **Story Browsing**: Grid/list view with filtering by genre, fandom, and completion status
- **Reading Modal**: Full-screen reading experience with chapter navigation
- **Search**: Real-time story search functionality
- **Responsive Design**: Mobile-first design with touch-friendly navigation
- **Genre-based Theming**: Color-coded genres for visual categorization

## Data Flow

1. **Story Discovery**: Users browse stories through the main interface with various filters
2. **Story Selection**: Clicking a story opens a detailed view with chapters
3. **Reading Experience**: Stories open in a full-screen modal for immersive reading
4. **State Management**: React Query manages all server state with caching and optimistic updates
5. **Database Operations**: Drizzle ORM handles all database interactions with type safety

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI Components
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: CSS-in-JS variant management
- **lucide-react**: Icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and dev server

## Deployment Strategy

### Development
- Frontend and backend run concurrently in development
- Vite dev server with HMR for frontend
- tsx for TypeScript execution in development
- Hot reload enabled for both client and server

### Production Build
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using esbuild
3. Static files served by Express in production
4. Environment variables manage database connections

### Database Management
- Drizzle Kit handles schema migrations
- `db:push` command for development schema updates
- PostgreSQL with Neon Database for production hosting
- Connection pooling and error handling built-in

### Key Architectural Decisions

**Database Choice**: PostgreSQL was chosen for its robust features, JSON support for tags, and excellent TypeScript integration through Drizzle ORM. Neon Database provides serverless PostgreSQL hosting.

**State Management**: TanStack Query eliminates the need for complex state management while providing excellent caching, background updates, and optimistic updates out of the box.

**UI Framework**: Radix UI + shadcn/ui provides accessible, customizable components without the overhead of larger UI libraries, while maintaining design consistency.

**Routing**: Wouter was chosen over React Router for its smaller bundle size and simpler API, suitable for the application's straightforward routing needs.

**Monorepo Structure**: The shared folder allows type sharing between frontend and backend, ensuring API contracts are type-safe across the entire application.