'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';

import type { Post } from '@/models/post';
import { PostService } from '@/services/post.service';
import { RequirePermission } from '@/components/admin/require-permission';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Loading } from '@/components/ui/loading';
import { PostForm } from '@/components/admin/post-form';

export default function AdminBlogEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? decodeURIComponent(String(params.id)) : '';

  const { data, isLoading } = useSWR<Post>(
    id ? [`/post/${id}`] : null,
    () => PostService.getPost(id),
  );

  return (
    <RequirePermission privileges={['blog:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Blog', href: '/admin/blog' },
            { label: data?.title ? data.title : 'Edit' },
          ]}
          title='Edit post'
          description='Update content, media, and publishing settings.'
        />

        {isLoading && !data ? (
          <div className='py-10'>
            <Loading label='Loading post…' />
          </div>
        ) : null}

        {data ? (
          <PostForm
            mode='edit'
            initialPost={data}
            onSubmit={(payload) => PostService.updatePost(id, payload)}
          />
        ) : null}
      </div>
    </RequirePermission>
  );
}
