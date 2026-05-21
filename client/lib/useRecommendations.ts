"use client";

import { useApi, useMutation } from "./hooks";
import {
  getRecommendations,
  refreshRecommendations,
  type Recommendation,
} from "./api";

export function useRecommendations() {
  return useApi<Recommendation[]>(() => getRecommendations(), []);
}

export function useRefreshRecommendations() {
  return useMutation<Recommendation[]>(() => refreshRecommendations());
}
