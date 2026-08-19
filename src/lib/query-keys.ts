import type { QueryClient } from "@tanstack/react-query";

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

/**
 * After a story or chapter mutation, invalidate every query that could be affected.
 * Story mutations affect: stories list, individual story pages, chapters list,
 * counts, analytics, public home/catalogue/search, and audio/video.
 * Chapter mutations additionally affect the parent story's chapter list.
 */
export function invalidateStoryData(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["admin", "stories"] }),
    qc.invalidateQueries({ queryKey: ["admin", "chapters"] }),
    qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
    qc.invalidateQueries({ queryKey: ["admin", "analytics"] }),
    qc.invalidateQueries({ queryKey: ["admin", "media"] }),
    qc.invalidateQueries({ queryKey: ["home"] }),
    qc.invalidateQueries({ queryKey: ["stories"] }),
    qc.invalidateQueries({ queryKey: ["story"] }),
    qc.invalidateQueries({ queryKey: ["chapter"] }),
    qc.invalidateQueries({ queryKey: ["genres"] }),
    qc.invalidateQueries({ queryKey: ["search"] }),
  ]);
}

/**
 * After a chapter publish/unpublish, invalidate story + chapter data
 * plus the specific story page and chapter pages.
 */
export function invalidateChapterData(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["admin", "chapters"] }),
    qc.invalidateQueries({ queryKey: ["admin", "stories"] }),
    qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
    qc.invalidateQueries({ queryKey: ["story"] }),
    qc.invalidateQueries({ queryKey: ["chapter"] }),
    qc.invalidateQueries({ queryKey: ["home"] }),
    qc.invalidateQueries({ queryKey: ["search"] }),
  ]);
}

/**
 * After a genre mutation, invalidate genre lists (admin + public) and
 * story lists (genres affect story cards).
 */
export function invalidateGenreData(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["admin", "genres"] }),
    qc.invalidateQueries({ queryKey: ["genres"] }),
    qc.invalidateQueries({ queryKey: ["stories"] }),
    qc.invalidateQueries({ queryKey: ["home"] }),
    qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
  ]);
}

/**
 * After a user role change.
 */
export function invalidateUserData(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["admin", "users"] }),
    qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
  ]);
}

/**
 * After a media asset change.
 */
export function invalidateMediaData(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["admin", "media"] }),
  ]);
}
