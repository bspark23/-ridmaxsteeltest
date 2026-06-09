'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

import type { Post } from '@/models/post';
import type { Media } from '@/models/media';
import { PostService } from '@/services/post.service';
import { RequirePermission } from '@/components/admin/require-permission';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  if (status === 'published') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
  if (status === 'draft') return 'bg-amber-500/15 text-amber-300 border-amber-500/20';
  if (status === 'scheduled') return 'bg-blue-500/15 text-blue-300 border-blue-500/20';
  return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20';
}

export default function AdminBlogDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ? decodeURIComponent(String(params.id)) : '';

  const { data, isLoading } = useSWR<Post>(
    id ? [`/post/${id}`] : null,
    () => PostService.getPost(id),
  );

  const post = data ? safePost(data) : null;

  return (
    <RequirePermission privileges={['blog:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Blog', href: '/admin/blog' },
            { label: post?.title ? post.title : 'Post' },
          ]}
          title={post?.title ?? 'Post details'}
          description='Preview and manage this post.'
          actions={
            post ? (
              <div className='flex items-center gap-2'>
                <Button asChild variant='outline'>
                  <Link href={`/admin/blog/${encodeURIComponent(post.id)}/edit`}>
                    <Pencil className='h-4 w-4' />
                    Edit
                  </Link>
                </Button>
                <Button asChild variant='secondary'>
                  <Link
                    href={`/blog/${encodeURIComponent(post.slug || slugify(post.title))}`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <ExternalLink className='h-4 w-4' />
                    View public
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete post</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete “{post.title}”.
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
                            router.push('/admin/blog');
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
            ) : null
          }
        />

        {isLoading && !post ? (
          <div className='py-10'>
            <Loading label='Loading post…' />
          </div>
        ) : null}

        {post ? (
          <div className='grid gap-6 lg:grid-cols-[1fr_420px]'>
            <Card className='border-white/10 bg-white/5'>
              <CardHeader className='gap-2'>
                <CardTitle className='text-white'>Preview</CardTitle>
                <CardDescription className='text-white/70'>
                  How it appears on the blog listing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostCard
                  post={post}
                  variant='horizontal'
                  className='overflow-hidden rounded-[2.25rem] bg-background/70 shadow-none hover:shadow-none'
                />
              </CardContent>
            </Card>

            <Card className='border-white/10 bg-white/5'>
              <CardHeader className='gap-2'>
                <CardTitle className='text-white'>Details</CardTitle>
                <CardDescription className='text-white/70'>
                  Status, metadata and stats.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Badge variant='outline' className={statusVariant(post.status)}>
                    {post.status}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='border-white/15 bg-white/[0.02] text-white/80'
                  >
                    {post.visibility}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='border-white/15 bg-white/[0.02] text-white/80'
                  >
                    {post.category?.name ?? 'General'}
                  </Badge>
                </div>

                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80'>
                  <div className='font-semibold text-white'>Slug</div>
                  <div className='mt-1 break-all text-white/70'>{post.slug}</div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                    <div className='text-xs text-white/60'>Views</div>
                    <div className='mt-1 text-lg font-semibold text-white'>
                      {post.stats?.views ?? 0}
                    </div>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                    <div className='text-xs text-white/60'>Reading time</div>
                    <div className='mt-1 text-lg font-semibold text-white'>
                      {post.stats?.readingTime ?? 1}m
                    </div>
                  </div>
                </div>

                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80'>
                  <div className='font-semibold text-white'>Meta</div>
                  <div className='mt-2 space-y-1 text-white/70'>
                    <div className='break-words'>
                      <span className='text-white/80'>Title:</span>{' '}
                      {post.meta?.title ?? post.title}
                    </div>
                    <div className='break-words'>
                      <span className='text-white/80'>Description:</span>{' '}
                      {post.meta?.description ?? post.excerpt}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </RequirePermission>
  );
}
