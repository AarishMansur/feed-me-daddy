"use client";

import { useApi, useMutation } from "./hooks";
import {
  getSubscriptions,
  getLikedVideos,
  getPlaylist,
  type Subscription,
  type Video,
  type PlaylistItem,
} from "./api";

export function useSubscriptions() {
  return useApi<Subscription[]>(() => getSubscriptions(), []);
}

export function useFeedVideos() {
  return useApi<Video[]>(() => getPlaylist(), []);
}

export function useLikedVideos() {
  return useApi<PlaylistItem[]>(() => getLikedVideos(), []);
}
