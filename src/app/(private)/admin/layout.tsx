"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AdminShell } from '@/components/admin/admin-shell';
import AuthLayout from '@/components/layouts/auth-layout';
import { Loading } from '@/components/ui/loading';
import { useAppSelector } from '@/store/hooks';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const normalized = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;
  const { isAuthenticated, loading, user } = useAppSelector((s) => s.auth);

  const isAdminSignin = normalized === '/admin';

  useEffect(() => {
    if (!isAdminSignin) return;
    if (loading) return;

    if (isAuthenticated && user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [isAdminSignin, isAuthenticated, loading, router, user?.role]);

  if (isAdminSignin && loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isAdminSignin && isAuthenticated && user?.role === 'admin') {
    return null;
  }

  if (isAdminSignin) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <AdminShell>{children}</AdminShell>;
}
