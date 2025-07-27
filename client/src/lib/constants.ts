export const GENRE_COLORS = {
  'Romance': 'hsl(0, 84.2%, 60.2%)', // red
  'Fantasy': 'hsl(142, 76%, 36%)', // emerald
  'Adventure': 'hsl(45, 93%, 47%)', // amber
  'Mystery': 'hsl(262, 83%, 58%)', // violet
  'Sci-Fi': 'hsl(199, 89%, 48%)', // cyan
  'Drama': 'hsl(24, 95%, 53%)', // orange
} as const;

export const GENRE_LABELS = {
  'Romance': 'romance',
  'Fantasy': 'fantasy', 
  'Adventure': 'adventure',
  'Mystery': 'mystery',
  'Sci-Fi': 'scifi',
  'Drama': 'drama',
} as const;

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Updated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'wordCount', label: 'Word Count' },
] as const;
