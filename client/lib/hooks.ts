import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "./api-client";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();

      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T | null>;
}

export function useMutation<T>(
  apiCall: () => Promise<ApiResponse<T>>
): UseMutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();

      if (response.error) {
        setError(response.error);
        setData(null);
        return null;
      } else {
        setData(response.data || null);
        return response.data || null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return {
    data,
    loading,
    error,
    execute,
  };
}
