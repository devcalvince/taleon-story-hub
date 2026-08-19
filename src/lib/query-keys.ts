export const queryKeys = {
  // Admin
  adminStories: ["admin", "stories"] as const,
  adminChapters: ["admin", "chapters"] as const,
  adminGenres: ["admin", "genres"] as const,
  adminUsers: ["admin", "users"] as const,
  adminContacts: ["admin", "contacts"] as const,
  adminNewsletter: ["admin", "newsletter"] as const,
  adminAnalytics: ["admin", "analytics"] as const,
  adminMedia: ["admin", "media"] as const,
  adminScenes: ["admin", "scenes"] as const,
  adminCharacters: ["admin", "characters"] as const,
  adminLocations: ["admin", "locations"] as const,
  adminCounts: ["admin", "counts"] as const,

  // Public
  home: ["home"] as const,
  stories: (params?: Record<string, unknown>) => ["stories", params] as const,
  story: (slug: string) => ["story", slug] as const,
  chapter: (slug: string, num: number) => ["chapter", slug, num] as const,
  genres: ["genres"] as const,
  search: (q: string) => ["search", q] as const,

  // User
  readingProgress: ["reading", "progress"] as const,
} as const;
