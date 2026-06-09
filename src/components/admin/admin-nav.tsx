'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenText,
  AppWindow,
  Cog,
  LayoutDashboard,
  Users,
} from 'lucide-react';

import { AppPrivilege, User } from '@/models/user';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export type AdminNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  requiredPrivileges?: AppPrivilege[];
};

const navGroups: Array<{ label: string; items: AdminNavItem[] }> = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        requiredPrivileges: ['dashboard:read'],
      },
      {
        label: 'Subscribers',
        href: '/admin/subscribers',
        icon: Users,
        requiredPrivileges: ['subscribers:read', 'subscribers:manage'],
      },
    ],
  },
  {
    label: 'CMS',
    items: [
      {
        label: 'Blog',
        href: '/admin/blog',
        icon: BookOpenText,
        requiredPrivileges: ['blog:manage'],
      },
      {
        label: 'Pages',
        href: '/admin/pages',
        icon: AppWindow,
        requiredPrivileges: ['page:manage'],
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      {
        label: 'Staff',
        href: '/admin/staff',
        icon: Users,
        requiredPrivileges: ['staff:manage'],
      },
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: Cog,
        requiredPrivileges: ['settings:read', 'settings:manage'],
      },
    ],
  },
];

export function hasAnyPermission(
  user: User | null | undefined,
  required?: AppPrivilege[],
) {
  if (!required?.length) return true;
  if (!user) return false;
  const privileges = user.privileges ?? [];
  if (user.role === 'admin' && privileges.length === 0) return true;
  const set = new Set(privileges);
  return required.some((p) => set.has(p));
}

export function AdminNav({
  user,
  className,
}: {
  user: User | null;
  className?: string;
}) {
  const pathname = usePathname();

  const normalizedPathname =
    pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;

  return (
    <nav className={cn('flex flex-col gap-2', className)}>
      {navGroups
        .map((group) => {
          const items = group.items.filter((item) =>
            hasAnyPermission(user, item.requiredPrivileges),
          );
          if (!items.length) return null;

          return (
            <SidebarGroup key={group.label} className='py-0'>
              <SidebarGroupLabel className='text-[11px] tracking-wide uppercase'>
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive = normalizedPathname === item.href;
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                          className={cn(
                            'rounded-xl',
                            isActive
                              ? 'bg-primary/12 text-foreground shadow-[0_0_0_1px_rgba(212,175,55,0.22)]'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <Link
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Icon className='h-4 w-4' />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })
        .filter(Boolean)}
    </nav>
  );
}
