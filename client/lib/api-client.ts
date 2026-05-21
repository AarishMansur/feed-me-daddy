const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 0,
    };
  }
}

export async function get<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

export async function post<T = any>(
  endpoint: string,
  body?: Record<string, any>,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T = any>(
  endpoint: string,
  body?: Record<string, any>,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}
