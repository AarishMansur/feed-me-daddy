import { prisma } from "../lib/prisma.js";
import type { Account } from "../../generated/prisma/client.js";
import { getLikedVideos, getSubscription, searchYouTubeVideos } from "../Feed/Feed.service.js";
import {
  analyzeVideoInterests,
  buildInterestProfile,
  getInterestCategories,
  getInterestKeywords,
} from "./interest-analyzer.js";
import {
  deduplicateRecommendations,
  generateRecommendations,
  type Recommendation,
  type Video,
} from "./reccomendation-engine.js";

type Subscription = {
  snippet?: {
    title?: string;
    description?: string;
  };
};

type YouTubeThumbnail = {
  url?: string;
};

type YouTubeSnippet = {
  title?: string;
  channelTitle?: string;
  description?: string;
  thumbnails?: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
  };
  resourceId?: {
    videoId?: string;
  };
};

type YouTubePlaylistItem = {
  snippet?: YouTubeSnippet;
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: YouTubeSnippet;
};

type YouTubeListResponse<T> = {
  items?: T[];
};

const getThumbnailUrl = (snippet?: YouTubeSnippet): string => {
  return snippet?.thumbnails?.high?.url
    || snippet?.thumbnails?.medium?.url
    || snippet?.thumbnails?.default?.url
    || "";
};

const normalizeLikedVideos = (response: YouTubeListResponse<YouTubePlaylistItem>): Video[] => {
  return (response.items || [])
    .flatMap((item) => {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) {
        return [];
      }

      return {
        id: videoId,
        ...(item.snippet?.title ? { title: item.snippet.title } : {}),
        ...(item.snippet?.channelTitle ? { channelTitle: item.snippet.channelTitle } : {}),
        ...(item.snippet?.description ? { description: item.snippet.description } : {}),
        thumbnail: getThumbnailUrl(item.snippet),
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
};

const normalizeSearchVideos = (response: YouTubeListResponse<YouTubeSearchItem>): Video[] => {
  return (response.items || [])
    .flatMap((item) => {
      const videoId = item.id?.videoId;
      if (!videoId) {
        return [];
      }

      return {
        id: videoId,
        ...(item.snippet?.title ? { title: item.snippet.title } : {}),
        ...(item.snippet?.channelTitle ? { channelTitle: item.snippet.channelTitle } : {}),
        ...(item.snippet?.description ? { description: item.snippet.description } : {}),
        thumbnail: getThumbnailUrl(item.snippet),
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
};

const normalizeSubscriptions = (response: YouTubeListResponse<Subscription>): Subscription[] => {
  return response.items || [];
};

const DISCOVERY_QUERY_MODIFIERS = [
  "explained",
  "documentary",
  "beginner guide",
  "deep dive",
  "case study",
  "why it matters",
];

const shuffle = <T>(items: T[]): T[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

const categoryToQuery = (category: string): string => {
  return category.replace(/_/g, " ");
};

const getTopInterestCategories = (interestProfile: Record<string, number>, maxCategories: number): string[] => {
  return Object.entries(interestProfile)
    .filter(([, score]) => score > 0)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, maxCategories)
    .map(([category]) => category);
};

const getTopInterestQueries = (interestProfile: Record<string, number>, maxQueries: number): string[] => {
  const queries = getTopInterestCategories(interestProfile, maxQueries)
    .map(categoryToQuery);

  return queries.length > 0 ? queries : ["popular videos"];
};

const getDiscoveryCategories = (
  interestProfile: Record<string, number>,
  maxCategories: number,
): string[] => {
  const topCategories = getTopInterestCategories(interestProfile, 3);
  const topCategorySet = new Set(topCategories);
  const candidates = getInterestCategories()
    .filter((category) => !topCategorySet.has(category));

  return shuffle(candidates).slice(0, maxCategories);
};

const getDiscoveryQueries = (
  categories: string[],
): string[] => {
  const queries = categories.map((category) => {
    const keywords = getInterestKeywords(category);
    const baseQuery = keywords[Math.floor(Math.random() * keywords.length)] || categoryToQuery(category);
    const modifier = DISCOVERY_QUERY_MODIFIERS[Math.floor(Math.random() * DISCOVERY_QUERY_MODIFIERS.length)];
    return `${baseQuery} ${modifier}`;
  });

  return queries.length > 0 ? queries : ["interesting documentaries"];
};

const buildExplorationProfile = (
  baseProfile: Record<string, number>,
  discoveryCategories: string[],
  blockedCategories: Set<string>,
): Record<string, number> => {
  const profile = Object.fromEntries(Object.keys(baseProfile).map((category) => [category, 0]));

  for (const category of discoveryCategories) {
    if (category in profile && !blockedCategories.has(category)) {
      profile[category] = 1;
    }
  }

  return profile;
};

const removeTopInterestVideos = (
  videos: Video[],
  blockedCategories: Set<string>,
): Video[] => {
  return videos.filter((video) => {
    const matches = analyzeVideoInterests(video);
    return !Object.keys(matches).some((category) => blockedCategories.has(category));
  });
};

export const getUserInterestProfile = async (account: Account) => {
  const [likedVideosResponse, subscriptionsResponse] = await Promise.all([
    getLikedVideos(account) as Promise<YouTubeListResponse<YouTubePlaylistItem>>,
    getSubscription(account) as Promise<YouTubeListResponse<Subscription>>,
  ]);

  return buildInterestProfile(
    normalizeLikedVideos(likedVideosResponse),
    normalizeSubscriptions(subscriptionsResponse),
  );
};

export const saveRecommendations = async (
  userId: string,
  recommendations: Recommendation[]
): Promise<void> => {
  if (recommendations.length === 0) {
    return;
  }

  await prisma.reccomendation.deleteMany({
    where: { userId },
  });

  await prisma.reccomendation.createMany({
    data: recommendations.map((rec) => ({
        userId,
        videoId: rec.videoID,
        videoLink: rec.videoLink,
        thumbnail: rec.thumbnail,
        title: rec.title ?? null,
        channelTitle: rec.channelTitle ?? null,
        category: rec.category,
    })),
  });
};

export const getUserRecommendations = async (userId: string, limit: number = 20) => {
  return prisma.reccomendation.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

export const refreshUserRecommendations = async (
  userId: string,
  account: Account,
  maxResults: number = 20
): Promise<Recommendation[]> => {
  const [likedVideosResponse, subscriptionsResponse] = await Promise.all([
    getLikedVideos(account) as Promise<YouTubeListResponse<YouTubePlaylistItem>>,
    getSubscription(account) as Promise<YouTubeListResponse<Subscription>>,
  ]);

  const likedVideos = normalizeLikedVideos(likedVideosResponse);
  const subscriptions = normalizeSubscriptions(subscriptionsResponse);
  const interestProfile = buildInterestProfile(likedVideos, subscriptions);
  const previousRecommendations = await getUserRecommendations(userId, maxResults);
  const blockedVideoIds = new Set([
    ...likedVideos.map((video) => video.id || ""),
    ...previousRecommendations.map((recommendation) => recommendation.videoId),
  ]);
  const blockedCategories = new Set(getTopInterestCategories(interestProfile, 3));

  const discoveryLimit = maxResults;
  const discoveryCategories = getDiscoveryCategories(interestProfile, 6);
  const discoveryQueries = getDiscoveryQueries(discoveryCategories);
  const explorationProfile = buildExplorationProfile(interestProfile, discoveryCategories, blockedCategories);

  const discoverySearchResponses = await Promise.all(
    discoveryQueries.map((query) => searchYouTubeVideos(
      account,
      query,
      Math.ceil(discoveryLimit / discoveryQueries.length) + 8,
    ) as Promise<YouTubeListResponse<YouTubeSearchItem>>)
  );
  const discoveryVideos = removeTopInterestVideos(
    discoverySearchResponses.flatMap(normalizeSearchVideos),
    blockedCategories,
  );
  const discoveryRecommendations = generateRecommendations(
    discoveryVideos,
    blockedVideoIds,
    explorationProfile,
    discoveryLimit
  );

  const recommendations = deduplicateRecommendations([
    ...discoveryRecommendations,
  ]).slice(0, maxResults);

  await saveRecommendations(userId, recommendations);

  return recommendations;
};
