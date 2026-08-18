import { createServerFn } from "@tanstack/react-start";
import {
  getChapter,
  getHome,
  getStory,
  listAudio,
  listGenres,
  listStories,
  listVideos,
  searchAll,
  type SortKey,
} from "./catalog.server";

export const fetchHome = createServerFn({ method: "GET" }).handler(async () => getHome());

export const fetchGenres = createServerFn({ method: "GET" }).handler(async () => listGenres());

export const fetchStories = createServerFn({ method: "GET" })
  .inputValidator((data: { sort?: SortKey; genre?: string; q?: string; status?: string }) => data ?? {})
  .handler(async ({ data }) => listStories(data));

export const fetchStory = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => getStory(data.slug));

export const fetchChapter = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; chapterNumber: number }) => data)
  .handler(async ({ data }) => getChapter(data.slug, data.chapterNumber));

export const fetchAudio = createServerFn({ method: "GET" }).handler(async () => listAudio());

export const fetchVideos = createServerFn({ method: "GET" }).handler(async () => listVideos());

export const fetchSearch = createServerFn({ method: "GET" })
  .inputValidator((data: { q: string }) => data)
  .handler(async ({ data }) => searchAll(data.q));
