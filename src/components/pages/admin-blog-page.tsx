'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';

import type { Post, PostPaginatedResult } from '@/models/post';
import type { Media } from '@/models/media';
import { PostService } from '@/services/post.service';
import { RequirePermission } from '@/components/admin/require-permission';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { PostCard } from '@/components/ui/post-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { slugify } from '@/lib/utils';

function safePost(post: Post): Post {
  const featured: Media =
    post.featuredMedia ?? {
      url: '/images/placeholder.jpg',
      alt: post.title,
      type: 'image',
      width: 1600,
      height: 900,
    };

  const category: Post['category'] =
    post.category ?? {
      id: 'general',
      name: 'General',
      slug: 'general',
    };

  const stats: Post['stats'] =
    post.stats ?? {
      views: 0,
      likes: 0,
      shares: 0,
      readingTime: 1,
      commentCount: 0,
    };

  return { ...post, featuredMedia: featured, category, stats };
}

function statusVariant(status: Post['status']) {
  if (status === 'published')
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
  if (status === 'draft')
    return 'bg-amber-500/15 text-amber-300 border-amber-500/20';
  if (status === 'scheduled')
    return 'bg-blue-500/15 text-blue-300 border-blue-500/20';
  return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20';
}

export default function AdminBlogPage() {
  const [q, setQ] = useState('');

  const key = useMemo(() => ['/post', { page: 1, limit: 100 }] as const, []);
  const { data, isLoading, mutate } = useSWR<PostPaginatedResult>(key);

  const posts = useMemo(() => {
    const raw = data?.posts ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return raw;
    return raw.filter((p) => {
      const haystack = [
        p.title,
        p.slug,
        p.excerpt,
        p.category?.name,
        ...(p.tags ?? []).map((t) => t.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [data?.posts, q]);

  return (
    <RequirePermission privileges={['blog:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          title='Blog'
          description='Create, edit, and manage your posts.'
          actions={
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => void mutate()}>
                Refresh
              </Button>
              <Button asChild>
                <Link href='/admin/blog/new'>
                  <Plus className='h-4 w-4' />
                  Create post
                </Link>
              </Button>
            </div>
          }
        />

        <Card className='border-white/10 bg-white/5'>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search posts…'
                className='h-9 w-full sm:w-80'
              />
              <div className='text-sm text-white/70'>
                {data?.pagination?.total !== undefined
                  ? `${data.pagination.total} total`
                  : `${posts.length} posts`}
              </div>
            </div>

            {isLoading ? (
              <Loading className='py-12 text-white/70' label='Loading posts…' />
            ) : null}

            {!isLoading && posts.length === 0 ? (
              <div className='mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70'>
                No posts found.
              </div>
            ) : null}

            {posts.length ? (
              <div className='mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3'>
                {posts.map((p) => {
                  const post = safePost(p);
                  return (
                    <div key={post.id}>
                      <PostCard
                        href={`/admin/blog/${encodeURIComponent(post.id)}`}
                        post={post}
                        variant='default'
                        className='overflow-hidden rounded-[2.25rem] bg-background/70 shadow-none hover:shadow-none'
                        actionsClassName='gap-2'
                        actions={
                          <>
                            <Badge
                              variant='outline'
                              className={statusVariant(post.status)}
                            >
                              {post.status}
                            </Badge>
                            <div className='flex items-center gap-2'>
                              <Button asChild size='sm' variant='outline'>
                                <Link
                                  href={`/admin/blog/${encodeURIComponent(post.id)}/edit`}
                                >
                                  Edit
                                </Link>
                              </Button>
                              <Button asChild size='sm' variant='secondary'>
                                <Link
                                  href={`/blog/${encodeURIComponent(post.slug || slugify(post.title))}`}
                                  target='_blank'
                                  rel='noreferrer'
                                >
                                  <ExternalLink className='h-4 w-4' />
                                  View
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size='sm' variant='destructive'>
                                    <Trash2 className='h-4 w-4' />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete post
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete “{post.title}
                                      ”.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      variant='destructive'
                                      onClick={async () => {
                                        try {
                                          await PostService.deletePost(post.id);
                                          toast.success('Post deleted');
                                          await mutate();
                                        } catch (e) {
                                          toast.error(
                                            e instanceof Error
                                              ? e.message
                                              : 'Failed to delete post',
                                          );
                                        }
                                      }}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </>
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}
