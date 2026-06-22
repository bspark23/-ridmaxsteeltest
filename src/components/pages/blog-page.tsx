"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { asNumber, cn } from "@/lib/utils";
import { Post, PostPaginatedResult } from "@/models/post";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// ─── Featured post card (large, image left + text right on amber bg) ──────────
function FeaturedCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt;
  const formatted = date ? format(new Date(date), "MMM d, yyyy") : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-primary/15 transition-colors hover:border-primary/25"
    >
      <div className="grid md:grid-cols-2">
        {/* Image side */}
        <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
          <Image
            src={post.featuredMedia?.url ?? "/images/placeholder.jpg"}
            alt={post.featuredMedia?.alt ?? post.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Text side — amber background */}
        <div className="bg-secondary p-5 flex flex-col justify-center sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.category?.name ? (
              <span className="text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full">
                {post.category.name}
              </span>
            ) : null}
            {post.stats?.readingTime ? (
              <span className="text-xs text-secondary-foreground/70 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.stats.readingTime} min read
              </span>
            ) : null}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-foreground leading-tight group-hover:underline">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-3 text-sm text-secondary-foreground/80 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-secondary-foreground/70">
              {post.author?.name ? (
                <span className="flex items-center gap-1">
                  <span className="h-5 w-5 rounded-full bg-primary/20 inline-flex items-center justify-center text-primary font-bold text-[10px]">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                  {post.author.name}
                </span>
              ) : null}
              {formatted ? (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatted}
                </span>
              ) : null}
            </div>
            <span className="inline-flex w-fit items-center gap-1 text-xs font-bold text-primary bg-white rounded-full px-4 py-1.5">
              Read Article <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Regular post card ────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt;
  const formatted = date ? format(new Date(date), "MMM d, yyyy") : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white border border-primary/15 transition-colors hover:border-primary/25"
    >
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Image
          src={post.featuredMedia?.url ?? "/images/placeholder.jpg"}
          alt={post.featuredMedia?.alt ?? post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        {post.category?.name ? (
          <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
            {post.category.name}
          </span>
        ) : null}
        <h3 className="mt-2 font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          {formatted ? (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatted}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Read more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="rounded-2xl bg-gray-100 animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

// ─── Main BlogPage ────────────────────────────────────────────────────────────
export default function BlogPage() {
  const searchParams = useSearchParams();
  const page = asNumber(searchParams.get("page"), 1);
  const limit = asNumber(searchParams.get("limit"), 9);

  const key = useMemo(() => ["/post", { page, limit }] as const, [page, limit]);
  const { data, isLoading } = useSWR<PostPaginatedResult>(key);
  const { siteContent } = useAppSelector((s) => s.content.content);

  const section1 = siteContent?.blog?.section1 ?? {};
  const posts = data?.posts ?? [];
  const pagination = data?.pagination;

  // First published post is the featured one, rest go in the grid
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative h-64 sm:h-72 flex items-center justify-center overflow-hidden bg-secondary pt-16">
        <div className="absolute inset-0">
          <Image
            src="/images/Ridmax-our-services/slide.png"
            alt="Our Blog"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="relative text-center px-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-secondary-foreground tracking-tight">
            {section1.title ?? "Our Blog"}
          </h1>
          {section1.body ? (
            <p className="mt-3 text-secondary-foreground/85 text-sm sm:text-base max-w-xl mx-auto">
              {section1.body}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto container px-6">
          {/* Loading state */}
          {isLoading ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : null}

          {/* Empty state */}
          {!isLoading && posts.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="mt-1 text-sm">Check back soon for new articles.</p>
            </div>
          ) : null}

          {/* Featured post */}
          {!isLoading && featured ? (
            <div className="mb-12">
              <FeaturedCard post={featured} />
            </div>
          ) : null}

          {/* Related / rest of posts */}
          {!isLoading && rest.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Industry insights, technical guides, and company updates from
                  the Ridmax Steel team.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : null}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 ? (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                <Link
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                    pagination.page <= 1
                      ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                      : "border-primary text-primary hover:bg-primary hover:text-white",
                  )}
                  href={{
                    pathname: "/blog",
                    query: { page: pagination.page - 1, limit },
                  }}
                >
                  Previous
                </Link>
                <Link
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                      : "border-primary text-primary hover:bg-primary hover:text-white",
                  )}
                  href={{
                    pathname: "/blog",
                    query: { page: pagination.page + 1, limit },
                  }}
                >
                  Next
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
            Ready to Start Your Project?
          </h2>
          <p className="mt-3 text-secondary-foreground/80 max-w-lg mx-auto text-sm leading-relaxed">
            Get in touch with our team today for competitive pricing and expert
            steel consultation.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-10"
          >
            <Link href="/contact">Contact Us Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
