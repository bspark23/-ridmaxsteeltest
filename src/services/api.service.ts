import { WEBSITE_DOMAIN } from '@/constants/content';
const DEFAULT_BASE_URL = `https://us-central1-ayha-the-market.cloudfunctions.net/api/v1/websites/${WEBSITE_DOMAIN}`;

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? DEFAULT_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details?: unknown[];
  };
  timestamp: string;
}

export type ApiKey = string | readonly [string, Record<string, unknown>];

export function buildQueryString(params?: Record<string, unknown>) {
  if (!params) return '';
  const query = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const value = params[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        query.append(key, String(item));
      }
      continue;
    }
    query.set(key, String(value));
  }
  return query.toString();
}

export function withQuery(endpoint: string, params?: Record<string, unknown>) {
  const qs = buildQueryString(params);
  if (!qs) return endpoint;
  return endpoint.includes('?') ? `${endpoint}&${qs}` : `${endpoint}?${qs}`;
}

export async function swrFetcher<T>(key: ApiKey): Promise<T> {
  if (typeof key === 'string') {
    return ApiService.request<T>(key);
  }
  const [endpoint, params] = key;
  return ApiService.request<T>(withQuery(endpoint, params));
}

export class ApiService {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        for (const [key, value] of options.headers) {
          headers[key] = value;
        }
      } else {
        Object.assign(headers, options.headers);
      }
    }
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized by attempting to refresh the token
    if (
      typeof window !== 'undefined' &&
      response.status === 401 &&
      endpoint !== '/auth/signin' &&
      endpoint !== '/auth/refresh'
    ) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshResult: ApiResponse<{
            accessToken: string;
            refreshToken: string;
          }> = await refreshResponse
            .json()
            .catch(
              () =>
                ({}) as ApiResponse<{
                  accessToken: string;
                  refreshToken: string;
                }>,
            );
          if (refreshResult.success && refreshResult.data?.accessToken) {
            localStorage.setItem('accessToken', refreshResult.data.accessToken);
            localStorage.setItem(
              'refreshToken',
              refreshResult.data.refreshToken,
            );

            // Retry the original request with the new token
            const newHeaders: Record<string, string> = {
              ...headers,
              Authorization: `Bearer ${refreshResult.data.accessToken}`,
            };
            return this.request(endpoint, { ...options, headers: newHeaders });
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }

      // If refresh fails or no token, clear auth tokens.
      // Only force navigation for protected admin routes; the /admin login page should not reload-loop.
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      const path = window.location.pathname
        ? window.location.pathname.replace(/\/+$/, '') || '/'
        : '/';
      const isProtectedAdminPath =
        path.startsWith('/admin/') && path !== '/admin';
      if (isProtectedAdminPath) window.location.href = '/admin';
    }

    const result: ApiResponse<T> = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      const errorMessage =
        result.error?.message || `API request failed: ${response.status}`;
      const error = new Error(errorMessage);
      if (result.error?.details) {
        (error as Error & { details?: unknown[] }).details =
          result.error.details;
      }
      throw error;
    }

    return result.data;
  }
}
