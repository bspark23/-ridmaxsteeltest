"use client";

import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

import { Post, PostComment } from "@/models/post";
import { PostService } from "@/services/post.service";
import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Loading } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";

// ─── Related article card ─────────────────────────────────────────────────────
function RelatedCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt;
  const formatted = date ? format(new Date(date), "MMM d, yyyy") : null;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white border border-primary/15 transition-colors hover:border-primary/25"
    >
      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
        <Image
          src={post.featuredMedia?.url ?? "/images/placeholder.jpg"}
          alt={post.featuredMedia?.alt ?? post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          {formatted ? <span>{formatted}</span> : null}
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Read more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main BlogDetailsPage ─────────────────────────────────────────────────────
export default function BlogDetailsPage({ post }: { post: Post }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const { data: relatedPosts } = useSWR<Post[]>(
    post.slug ? `/post/slug/${post.slug}/related` : null,
  );

  const {
    data: comments,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = useSWR<PostComment[]>(
    post.allowComments ? `/post/${post.id}/comments` : null,
  );

  const publishedAt = useMemo(() => {
    const date = post.publishedAt || post.createdAt;
    return date ? format(new Date(date), "MMM d, yyyy") : "";
  }, [post.createdAt, post.publishedAt]);

  const readingTime = post.stats?.readingTime ?? 0;
  const canComment = post.allowComments && isAuthenticated && !!user;

  const initials = useMemo(
    () => (name?: string) => {
      const v = (name ?? "").trim();
      if (!v) return "?";
      return v
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("");
    },
    [],
  );

  async function submitComment() {
    const content = commentText.trim();
    if (!content || !post.allowComments || !canComment) return;
    try {
      setPosting(true);
      await PostService.addComment(post.id, { content });
      setCommentText("");
      await mutateComments();
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="overflow-x-hidden bg-white">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-secondary pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={post.featuredMedia?.url ?? "/images/placeholder.jpg"}
            alt={post.featuredMedia?.alt ?? post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/60 to-secondary/20" />
        </div>

        <div className="relative mx-auto container px-6 pb-12 pt-32">
          {/* Back + category row */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="rounded-full bg-white/15 text-white hover:bg-white/25 border-0"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to blog
              </Link>
            </Button>
            {post.category?.name ? (
              <Badge className="bg-secondary text-secondary-foreground border-0 text-xs font-semibold">
                {post.category.name}
              </Badge>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-3xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt ? (
            <p className="mt-4 text-white/75 text-base max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            {post.author?.name ? (
              <span className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
                {post.author.name}
              </span>
            ) : null}
            {publishedAt ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {publishedAt}
              </span>
            ) : null}
            {readingTime ? (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {readingTime} min read
              </span>
            ) : null}
            {post.stats?.commentCount ? (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {post.stats.commentCount}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── ARTICLE CONTENT ──────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          <div
            className="prose prose-slate max-w-none
              prose-headings:text-primary prose-headings:font-bold
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-li:text-gray-600
              prose-blockquote:border-l-secondary prose-blockquote:text-gray-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* ── COMMENTS ─────────────────────────────────────────────────────── */}
      {post.allowComments ? (
        <section className="py-14 border-t bg-gray-50">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold text-primary mb-1">Comments</h2>
            <p className="text-sm text-gray-500 mb-8">
              Sign in to join the conversation.
            </p>

            {!isAuthenticated ? (
              <div className="rounded-2xl border border-primary/15 bg-white p-6">
                <p className="text-sm text-gray-500">
                  You must be signed in to comment.
                </p>
                <Button asChild className="mt-4 rounded-full" size="sm">
                  <Link href="/admin">Sign in</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary/15 bg-white p-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Add a comment
                </p>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment…"
                  className="min-h-28"
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    className="rounded-full"
                    size="sm"
                    disabled={!commentText.trim() || posting || !canComment}
                    onClick={submitComment}
                  >
                    {posting ? "Posting…" : "Post comment"}
                  </Button>
                </div>
              </div>
            )}

            {commentsLoading ? (
              <Loading
                className="py-10 text-muted-foreground"
                label="Loading comments…"
              />
            ) : null}

            {!commentsLoading && (comments ?? []).length === 0 ? (
              <Empty className="mt-6 rounded-2xl border border-primary/15 bg-white">
                <EmptyHeader>
                  <EmptyTitle>No comments yet</EmptyTitle>
                  <EmptyDescription>
                    Be the first to leave a comment.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {(comments ?? []).length > 0 ? (
              <div className="mt-6 space-y-4">
                {(comments ?? []).map((c) => (
                  <div key={c.id} className="rounded-2xl border border-primary/15 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                        {initials(c.author?.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">
                            {c.author?.name ?? "Guest"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {c.createdAt
                              ? format(new Date(c.createdAt), "MMM d, yyyy")
                              : ""}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── RELATED ARTICLES ─────────────────────────────────────────────── */}
      {(relatedPosts ?? []).length > 0 ? (
        <section className="py-14 border-t bg-white">
          <div className="mx-auto container px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Related Articles
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  More insights from the Ridmax Steel team.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full flex-shrink-0"
              >
                <Link href="/blog">See all posts</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {(relatedPosts ?? []).slice(0, 3).map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
