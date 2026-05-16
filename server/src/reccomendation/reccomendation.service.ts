import { prisma } from "../lib/prisma.js";
import type { Account } from "../../generated/prisma/client.js";
import { getLikedVideos, getSubscription, searchYouTubeVideos } from "../Feed/Feed.service.js";
import { buildInterestProfile } from "./interest-analyzer.js";
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
        ...(item.snippet?.description ? { description: item.snippet.description } : {}),
        thumbnail: getThumbnailUrl(item.snippet),
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
};

const normalizeSubscriptions = (response: YouTubeListResponse<Subscription>): Subscription[] => {
  return response.items || [];
};

const getTopInterestQueries = (interestProfile: Record<string, number>, maxQueries: number): string[] => {
  const queries = Object.entries(interestProfile)
    .filter(([, score]) => score > 0)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, maxQueries)
    .map(([category]) => category.replace(/_/g, " "));

  return queries.length > 0 ? queries : ["popular videos"];
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
  await prisma.reccomendation.deleteMany({
    where: { userId },
  });

  if (recommendations.length === 0) {
    return;
  }

  await prisma.reccomendation.createMany({
    data: recommendations.map((rec) => ({
        userId,
        videoID: rec.videoID,
        videoLink: rec.videoLink,
        thumbnail: rec.thumbnail,
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
  const likedVideoIds = new Set(likedVideos.map(v => v.id || ""));
  const queries = getTopInterestQueries(interestProfile, 3);
  const searchResponses = await Promise.all(
    queries.map((query) => searchYouTubeVideos(account, query, Math.ceil(maxResults / queries.length) + 5) as Promise<YouTubeListResponse<YouTubeSearchItem>>)
  );
  const candidateVideos = searchResponses.flatMap(normalizeSearchVideos);

  const recommendations = deduplicateRecommendations(generateRecommendations(
    candidateVideos,
    likedVideoIds,
    interestProfile,
    maxResults
  )).slice(0, maxResults);

  await saveRecommendations(userId, recommendations);

  return recommendations;
};
