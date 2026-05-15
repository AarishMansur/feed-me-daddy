import {prisma} from "../lib/prisma.js"
import type { Account } from "../../generated/prisma/client.js"
import { generateRecommendations } from "./reccomendation-engine.js"
import { buildInterestProfile } from "./interest-analyzer.js"
import { getLikedVideos } from "../Feed/Feed.service.js"

type Video = {
  id?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  link?: string;
};

type Subscription = {
  snippet?: {
    title?: string;
    description?: string;
  };
};

type Recommendation = {
  videoID: string;
  videoLink: string;
  thumbnail: string;
  category: string;
  score: number;
  matchedKeywords: string[];
};

export const getUserInterestProfile = async (userId: string) => {
   // use functions to get userLiked videos
  return {};
};