"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/ui/loading";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Never act while auth state is still loading
    if (loading) return;

    const normalizedPathname =
      pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
    const isSigninPage = normalizedPathname === "/admin";
    const isAdminPath =
      normalizedPathname === "/admin" || normalizedPathname.startsWith("/admin/");

    // On the sign-in page: if already authenticated as admin, go to dashboard
    if (isSigninPage && isAuthenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    // On a protected admin page: if not authenticated, send to sign-in
    if (!isAuthenticated && isAdminPath && !isSigninPage) {
      router.replace("/admin");
      return;
    }

    // Authenticated but NOT admin role — only redirect if role is explicitly
    // set to a non-admin value. If role is missing/undefined (e.g. still
    // hydrating), do nothing to avoid a false redirect to home.
    if (
      isAuthenticated &&
      isAdminPath &&
      !isSigninPage &&
      user?.role !== undefined &&
      user?.role !== "admin"
    ) {
      router.replace("/admin");
      return;
    }
  }, [isAuthenticated, loading, pathname, router, user?.role]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
