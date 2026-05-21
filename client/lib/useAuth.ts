"use client";

import { useState, useEffect } from "react";
import { getSession, signOut as apiSignOut, type Session } from "./api";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSession();

      if (response.error) {
        setError(response.error);
        setSession(null);
      } else {
        setSession(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const signOut = async () => {
    try {
      await apiSignOut();
      setSession(null);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out");
    }
  };

  return {
    session,
    loading,
    error,
    signOut,
    refetch: fetchSession,
  };
}

export function useUser() {
  const { session, loading, error } = useAuth();
  return {
    user: session?.user || null,
    loading,
    error,
  };
}
