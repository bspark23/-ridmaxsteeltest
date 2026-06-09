"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/auth-slice";

/**
 * AuthProvider — resolves the auth loading state on mount.
 *
 * Strategy:
 * - If a token exists in localStorage AND the Redux store already has a
 *   persisted user (from redux-persist rehydration), trust that session
 *   immediately and stop loading. Do NOT call /auth/profile — the API may
 *   be unavailable and a 404/error would incorrectly sign the user out.
 * - If no token exists, mark as not loading (unauthenticated).
 * - Token expiry is handled by the API service's 401 refresh logic — once
 *   an authenticated request fails with 401 and refresh fails, the service
 *   clears localStorage and redirects to /admin.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (!token) {
      // No token — immediately mark as not loading / not authenticated
      dispatch(setLoading(false));
      return;
    }

    if (user && isAuthenticated) {
      // Persisted user exists and token is present — trust the session
      dispatch(setLoading(false));
      return;
    }

    // Token exists but no persisted user — stop loading so guard can redirect
    // to sign-in. The user will need to sign in again.
    dispatch(setLoading(false));
  }, [dispatch, isAuthenticated, user]);

  return <>{children}</>;
}
