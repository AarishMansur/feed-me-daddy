import { get, post, ApiResponse } from "./api-client";

export interface Subscription {
  id: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
  channelTitle?: string;
  channelId?: string;
  viewCount?: number;
  likeCount?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  videoCount?: number;
}

export interface PlaylistItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoId: string;
  position?: number;
}

export interface Recommendation {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channelTitle?: string;
  reason?: string;
  score?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  googleId?: string;
}

export interface Session {
  user: User;
  expiresAt: string;
}

export async function getSubscriptions(): Promise<
  ApiResponse<Subscription[]>
> {
  return get<Subscription[]>("/api/youtube/subscriptions");
}

export async function getPlaylist(): Promise<ApiResponse<Video[]>> {
  return get<Video[]>("/api/youtube/playlist");
}

export async function getLikedVideos(): Promise<ApiResponse<PlaylistItem[]>> {
  return get<PlaylistItem[]>("/api/youtube/likedVideos");
}

export async function getRecommendations(): Promise<
  ApiResponse<Recommendation[]>
> {
  return get<Recommendation[]>("/api/reccomendation");
}

export async function refreshRecommendations(): Promise<
  ApiResponse<Recommendation[]>
> {
  return post<Recommendation[]>("/api/reccomendation/refresh");
}

export async function getSession(): Promise<ApiResponse<Session>> {
  return get<Session>("/api/auth/get-session");
}

export async function signOut(): Promise<ApiResponse<void>> {
  return post<void>("/api/auth/sign-out");
}

export async function signInGoogle(): Promise<ApiResponse<Session>> {
  return get<Session>("/api/auth/callback/google");
}
