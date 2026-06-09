import type { MetadataRoute } from 'next';

import { ContentService } from '@/services/content.service';
import { PostService } from '@/services/post.service';
import type { Link } from '@/models/settings';

function normalizePath(path: string) {
  const trimmed = path.trim();
  if (!trimmed) return '/';
  if (!trimmed.startsWith('/')) return trimmed;
  const normalized = trimmed !== '/' ? trimmed.replace(/\/+$/, '') : trimmed;
  return normalized || '/';
}

function collectInternalHrefs(links: Link[]): string[] {
  const out: string[] = [];
  for (const link of links) {
    if (typeof link.href === 'string' && link.href.startsWith('/')) {
      out.push(link.href);
    }
    if (Array.isArray(link.dropdown) && link.dropdown.length > 0) {
      out.push(...collectInternalHrefs(link.dropdown));
    }
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await ContentService.getContent();
  const siteUrl = (content?.systemSettings?.siteUrl || 'http://localhost:3000').replace(
    /\/+$/,
    '',
  );

  const headerLinks = content?.systemSettings?.headerLinks ?? [];
  const paths = ['/', ...collectInternalHrefs(headerLinks)]
    .map(normalizePath)
    .filter((p) => !p.startsWith('/admin'));

  const blogPaths = await (async () => {
    try {
      const res = await PostService.getPosts({ page: 1, limit: 1000 });
      return (res.posts ?? [])
        .filter((p) => p.status === 'published' && p.visibility === 'public')
        .map((p) => `/blog/${p.slug}`);
    } catch {
      return [];
    }
  })();

  const uniquePaths = Array.from(new Set([...paths, ...blogPaths]));

  const lastModified = new Date();
  return uniquePaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
  }));
}
