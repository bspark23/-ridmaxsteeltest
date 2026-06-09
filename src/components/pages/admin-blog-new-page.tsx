'use client';

import { RequirePermission } from '@/components/admin/require-permission';
import { AdminPageHeader } from '@/components/admin/page-header';
import { PostForm } from '@/components/admin/post-form';
import { PostService } from '@/services/post.service';

export default function AdminBlogNewPage() {
  return (
    <RequirePermission privileges={['blog:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Blog', href: '/admin/blog' },
            { label: 'New post' },
          ]}
          title='New post'
          description='Create a new blog post.'
        />
        <PostForm
          mode='create'
          onSubmit={(payload) => PostService.createPost(payload)}
        />
      </div>
    </RequirePermission>
  );
}
