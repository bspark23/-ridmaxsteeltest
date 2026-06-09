import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailsPage from '@/components/pages/blog-details-page';
import { PostService } from '@/services/post.service';
import type { Post } from '@/models/post';

type Params = { slug: string };

async function fetchPost(slug: string): Promise<Post | null> {
  try {
    return await PostService.getPostBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs: string[] = [];
    let page = 1;
    const limit = 50;

    while (true) {
      const result = await PostService.getPosts({ page, limit });
      slugs.push(...result.posts.map((p) => p.slug).filter(Boolean));

      if (
        !result.pagination?.totalPages ||
        page >= result.pagination.totalPages
      ) {
        break;
      }
      page += 1;
    }

    return Array.from(new Set(slugs)).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchPost(slug);

  if (!blog) {
    return {
      title: 'Blog post not found',
      description: 'The requested blog post could not be found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.tags?.length ? blog.tags.map((tag) => tag.name) : [],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.featuredMedia.url,
          width: blog.featuredMedia.width,
          height: blog.featuredMedia.height,
          alt: blog.featuredMedia.alt || blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.featuredMedia.url,
          width: blog.featuredMedia.width,
          height: blog.featuredMedia.height,
          alt: blog.featuredMedia.alt || blog.title,
        },
      ],
    },
  };
}

export default async function BlogSlugPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { slug } = await params;
  const blog = await fetchPost(slug);
  if (!blog) return notFound();

  return <BlogDetailsPage post={blog} />;
}
