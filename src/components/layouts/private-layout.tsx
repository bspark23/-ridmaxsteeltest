"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/providers/auth-guard";
import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/ui/loading";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const normalizedPathname =
    pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
  const isAdminSigninPage = normalizedPathname === "/admin";

  useEffect(() => {
    if (loading) return;
    if (!isAdminSigninPage) return;

    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [isAdminSigninPage, isAuthenticated, loading, router, user?.role]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isAdminSigninPage) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
