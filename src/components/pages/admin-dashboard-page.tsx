'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import useSWR from 'swr';
import {
  AppWindow,
  ArrowRight,
  BookOpenText,
  Cog,
  ExternalLink,
  Plus,
  Users,
} from 'lucide-react';

import type { PostPaginatedResult } from '@/models/post';
import { SubscriberService, type SubscribersListResult } from '@/services/subscriber.service';
import { PostService } from '@/services/post.service';
import { useAppSelector } from '@/store/hooks';
import { hasAnyPermission } from '@/components/admin/admin-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PostCard } from '@/components/ui/post-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(isoString: string) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

export default function AdminDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { systemSettings } = useAppSelector((s) => s.content.content);

  const canManageBlog = hasAnyPermission(user, ['blog:manage']);
  const canManagePages = hasAnyPermission(user, ['page:manage']);
  const canManageSubscribers = hasAnyPermission(user, [
    'subscribers:read',
    'subscribers:manage',
  ]);
  const canManageSettings = hasAnyPermission(user, ['settings:manage']);

  const { data: subscribersData } = useSWR<SubscribersListResult>(
    ['/subscriber', { page: 1, limit: 3 }],
    () => SubscriberService.list({ page: 1, limit: 3 }),
  );

  const { data: postsData } = useSWR<PostPaginatedResult>(
    ['/post', { page: 1, limit: 3 }],
    () => PostService.getPosts({ page: 1, limit: 3 }),
  );

  const recentSubscribers = useMemo(() => {
    return (subscribersData?.subscribers ?? []).slice(0, 3);
  }, [subscribersData?.subscribers]);

  const subscriberTotal = useMemo(() => {
    const total = subscribersData?.pagination?.total;
    if (typeof total === 'number') return total;
    const list = subscribersData?.subscribers;
    if (Array.isArray(list)) return list.length;
    return 0;
  }, [subscribersData?.pagination?.total, subscribersData?.subscribers]);

  const postTotal = useMemo(() => {
    const total = postsData?.pagination?.total;
    if (typeof total === 'number') return total;
    const list = postsData?.posts;
    if (Array.isArray(list)) return list.length;
    return 0;
  }, [postsData?.pagination?.total, postsData?.posts]);

  const recentPosts = useMemo(() => {
    return (postsData?.posts ?? []).slice(0, 3);
  }, [postsData?.posts]);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-balance text-2xl font-semibold tracking-tight text-white'>
            Dashboard
          </h1>
          <p className='text-sm text-white/70'>
            Quick access to content, subscribers, and configuration.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button asChild variant='secondary'>
            <Link href='/' target='_blank' rel='noreferrer'>
              <ExternalLink className='h-4 w-4' />
              View site
            </Link>
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.14),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]'>
          <CardHeader className='gap-1'>
            <CardTitle className='flex items-center gap-2 text-white'>
              <div className='inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/20'>
                <BookOpenText className='h-4 w-4' />
              </div>
              Blog posts
            </CardTitle>
            <CardDescription className='text-white/70'>
              Total posts created.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-end justify-between'>
            <div className='text-3xl font-semibold tracking-tight text-white'>
              {postTotal}
            </div>
            <div className='text-sm text-white/70'>total</div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]'>
          <CardHeader className='gap-1'>
            <CardTitle className='flex items-center gap-2 text-white'>
              <div className='inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200 ring-1 ring-blue-500/20'>
                <Users className='h-4 w-4' />
              </div>
              Subscribers
            </CardTitle>
            <CardDescription className='text-white/70'>
              Latest sign-ups and enquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-end justify-between'>
            <div className='text-3xl font-semibold tracking-tight text-white'>
              {subscriberTotal}
            </div>
            <div className='text-sm text-white/70'>total</div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]'>
          <CardHeader className='gap-1'>
            <CardTitle className='flex items-center gap-2 text-white'>
              <div className='inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/20'>
                <Cog className='h-4 w-4' />
              </div>
              System
            </CardTitle>
            <CardDescription className='text-white/70'>
              Operational state and toggles.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <div className='space-y-1'>
              <div className='text-sm font-medium text-white'>Maintenance</div>
              <div className='text-xs text-white/70'>
                {systemSettings?.maintenanceMode ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <Badge
              variant={systemSettings?.maintenanceMode ? 'destructive' : 'secondary'}
            >
              {systemSettings?.maintenanceMode ? 'On' : 'Off'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {canManageBlog || canManagePages || canManageSubscribers || canManageSettings ? (
        <Card className='border-white/10 bg-white/5'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Quick actions</CardTitle>
            <CardDescription className='text-white/70'>
              Jump straight into the most common tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2 pt-0'>
            {canManageBlog ? (
              <>
                <Button asChild>
                  <Link href='/admin/blog/new'>
                    <Plus className='h-4 w-4' />
                    Create blog post
                  </Link>
                </Button>
              </>
            ) : null}

            {canManagePages ? (
              <Button asChild variant='secondary'>
                <Link href='/admin/pages'>
                  <AppWindow className='h-4 w-4' />
                  Edit pages
                </Link>
              </Button>
            ) : null}

            {canManageSubscribers ? (
              <Button asChild variant='secondary'>
                <Link href='/admin/subscribers'>
                  <Users className='h-4 w-4' />
                  View subscribers
                </Link>
              </Button>
            ) : null}

            {canManageSettings ? (
              <Button asChild variant='secondary'>
                <Link href='/admin/settings'>
                  <Cog className='h-4 w-4' />
                  Settings
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {canManageBlog ? (
        <Card className='border-white/10 bg-white/5'>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle className='text-white'>Recent posts</CardTitle>
              <CardDescription className='text-white/70'>
                Latest blog posts.
              </CardDescription>
            </div>
            <Button asChild variant='secondary' size='sm'>
              <Link href='/admin/blog'>
                Manage blog
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className='pt-0'>
            {recentPosts.length ? (
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    href={`/admin/blog/${encodeURIComponent(post.id)}`}
                    variant='default'
                  />
                ))}
              </div>
            ) : (
              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70'>
                No posts yet.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {canManageSubscribers ? (
        <Card className='border-white/10 bg-white/5'>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle className='text-white'>Recent subscribers</CardTitle>
              <CardDescription className='text-white/70'>
                A quick look at the latest contacts.
              </CardDescription>
            </div>
            <Button asChild variant='secondary' size='sm'>
              <Link href='/admin/subscribers'>
                View all
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className='pt-0'>
            {recentSubscribers.length ? (
              <Table>
                <TableHeader>
                  <TableRow className='border-white/10'>
                    <TableHead className='text-white/80'>Contact</TableHead>
                    <TableHead className='text-white/80'>Type</TableHead>
                    <TableHead className='text-right text-white/80'>
                      Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubscribers.map((s) => (
                    <TableRow key={s.id ?? s.email} className='border-white/10'>
                      <TableCell className='min-w-0'>
                        <div className='min-w-0'>
                          <div className='truncate font-medium text-white'>
                            {s.name || 'Unknown'}
                          </div>
                          <div className='truncate text-xs text-white/60'>
                            {s.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className='border-white/15 text-white/80'
                        >
                          {s.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right text-sm text-white/70'>
                        {formatDate(s.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70'>
                No subscribers yet.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
