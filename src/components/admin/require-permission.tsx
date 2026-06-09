"use client";

import { ReactNode } from 'react';
import { AppPrivilege } from '@/models/user';
import { useAppSelector } from '@/store/hooks';
import { hasAnyPermission } from './admin-nav';

export function RequirePermission({
  privileges,
  children,
}: {
  privileges: AppPrivilege[];
  children: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);
  if (!hasAnyPermission(user, privileges)) {
    return (
      <div className="rounded-lg border p-6">
        <div className="text-lg font-semibold">Access denied</div>
        <div className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
