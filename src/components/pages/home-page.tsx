"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Truck,
  Users,
  Tag,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Item } from "@/models/content";
import useSWR from "swr";
import { Post, PostPaginatedResult } from "@/models/post";

// ─── Icon map for "Why Choose Us" cards ─────────────────────────────────────
const WHY_ICONS: Record<string, React.ReactNode> = {
  shield: <Shield className="h-5 w-5" />,
  truck: <Truck className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  tag: <Tag className="h-5 w-5" />,
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="block h-0.5 w-8 bg-secondary" />
      <span className="text-sm font-semibold tracking-widest uppercase text-secondary">
        {text}
      </span>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ item }: { item: Item }) {
  return (
    <Link
      href={item.href ?? "/products"}
      className="group block overflow-hidden rounded-xl bg-white shadow hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.body}</p>
      </div>
    </Link>
  );
}

// ─── Why Choose Card — icon top-left, title bold, body text below ─────────────
function WhyCard({ item }: { item: Item }) {
  const icon = item.subtitle ? (WHY_ICONS[item.subtitle] ?? null) : null;
  return (
    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Icon badge */}
      <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary mb-5">
        {icon}
      </div>
      {/* Title */}
      <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
      {/* Body */}
      <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
    </div>
  );
}

// ─── Stat Card — white rounded card with star icon ───────────────────────────
function StatCard({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
        <Star className="h-4 w-4" />
      </div>
      <div>
        <p className="text-2xl font-bold text-primary leading-none">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 mt-1">{item.body}</p>
      </div>
    </div>
  );
}

// ─── Service Card ────────────────────────────────────────────────────────────
function ServiceCard({ item }: { item: Item }) {
  return (
    <Link
      href={item.href ?? "/services"}
      className="group relative block overflow-hidden rounded-2xl h-72 shadow hover:shadow-lg transition-shadow"
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="mt-1 text-xs text-white/80 line-clamp-2">{item.body}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
          Learn more <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

// ─── Blog Post Card (API data) ───────────────────────────────────────────────
function BlogCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow hover:shadow-md transition-shadow"
    >
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <Image
          src={post.featuredMedia?.url ?? "/images/placeholder.jpg"}
          alt={post.featuredMedia?.alt ?? post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        {post.category?.name ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            {post.category.name}
          </span>
        ) : null}
        <h3 className="mt-2 font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          {formattedDate ? <span>{formattedDate}</span> : null}
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Read more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty Blog State ─────────────────────────────────────────────────────────
function BlogEmptyState() {
  return (
    <div className="col-span-3 py-16 text-center text-gray-400 text-sm">
      No posts yet — check back soon.
    </div>
  );
}

// ─── Main HomePage ───────────────────────────────────────────────────────────
export default function HomePage() {
  const { siteContent } = useAppSelector((s) => s.content.content);

  const hero = siteContent?.home?.section1 ?? {};
  const products = siteContent?.home?.section2 ?? {};
  const whyUs = siteContent?.home?.section3 ?? {};
  const stats = siteContent?.home?.section4 ?? {};
  const services = siteContent?.home?.section5 ?? {};
  const blogSection = siteContent?.home?.section6 ?? {};
  const cta = siteContent?.home?.section7 ?? {};

  // Always fetch from the API — no static fallback
  const { data: blogData, isLoading: blogLoading } =
    useSWR<PostPaginatedResult>(["/post", { page: 1, limit: 3 }]);
  const apiPosts = blogData?.posts ?? [];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[84vh] flex items-start overflow-hidden bg-gray-900">
        {/* Background image only — no tint or overlay */}
        {hero.image ? (
          <div className="absolute inset-0">
            <Image
              src={hero.image}
              alt={hero.title ?? "Ridmax Steel"}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : null}

        <div className="relative mx-auto container px-6 py-20 pt-24 sm:py-16 sm:pt-20">
          <div className="ml-auto flex w-full max-w-xl flex-col items-end text-right">
            {/* Breadcrumb overline */}
            <div className="flex items-center justify-end gap-2 mb-4 text-white/70 text-xs font-medium tracking-wide uppercase">
              <span>Home</span>
              <span>/</span>
              <span>Products</span>
            </div>

            {/* Headline — highlighted word on its own line */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {hero.title?.includes(hero.subtitle ?? "Premium Steel") ? (
                <>
                  <span className="text-primary">
                    {hero.title.split(hero.subtitle ?? "Premium Steel")[0]}
                  </span>
                  <span className="mt-1 block text-secondary">
                    {hero.subtitle ?? "Premium Steel"}
                  </span>
                  {hero.title.split(hero.subtitle ?? "Premium Steel")[1]}
                </>
              ) : (
                (hero.title ?? "")
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-md">
              {hero.body ?? ""}
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {(hero.buttons ?? [hero.button]).filter(Boolean).map((btn, i) =>
                btn ? (
                  <Button
                    key={btn.href}
                    asChild
                    size="lg"
                    className={
                      i === 0
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full font-semibold"
                        : "bg-white/10 text-white border border-white/30 hover:bg-white/20 rounded-full font-semibold backdrop-blur-sm"
                    }
                    variant={i === 0 ? "secondary" : "ghost"}
                  >
                    <Link href={btn.href}>{btn.title}</Link>
                  </Button>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto container px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              {products.subtitle ? (
                <SectionLabel text={products.subtitle} />
              ) : null}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {products.title ?? "Our Products"}
              </h2>
              <p className="mt-2 text-gray-500 max-w-xl text-sm">
                {products.body ?? ""}
              </p>
            </div>
            {products.button ? (
              <Button
                asChild
                variant="secondary"
                className="rounded-full flex-shrink-0"
              >
                <Link
                  href={products.button.href}
                  className="flex items-center gap-2"
                >
                  {products.button.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {(products.items ?? []).map((item) => (
              <ProductCard key={item.title} item={item} />
            ))}
          </div>

          {products.button ? (
            <div className="mt-10 flex justify-center">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-full px-8"
              >
                <Link href={products.button.href}>{products.button.title}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto container px-6">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
              {whyUs.title ?? "Why Choose Ridmaxsteel?"}
            </h2>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              {whyUs.body ?? ""}
            </p>
          </div>

          {/* 2×2 cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {(whyUs.items ?? []).map((item) => (
              <WhyCard key={item.title} item={item} />
            ))}
          </div>

          {/* Stats row — white cards with star icon */}
          {(stats.items ?? []).length > 0 ? (
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {(stats.items ?? []).map((item) => (
                <StatCard key={item.title} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── OUR SERVICES ────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto container px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              {services.subtitle ? (
                <SectionLabel text={services.subtitle} />
              ) : null}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {services.title ?? "Our Services"}
              </h2>
              <p className="mt-2 text-gray-500 max-w-xl text-sm">
                {services.body ?? ""}
              </p>
            </div>
            {services.button ? (
              <Button
                asChild
                variant="outline"
                className="rounded-full flex-shrink-0"
              >
                <Link
                  href={services.button.href}
                  className="flex items-center gap-2"
                >
                  {services.button.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {(services.items ?? []).map((item) => (
              <ServiceCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG / RECENT UPDATES (API only) ────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto container px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              {blogSection.subtitle ? (
                <SectionLabel text={blogSection.subtitle} />
              ) : null}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {blogSection.title ?? "Recent Updates"}
              </h2>
              <p className="mt-2 text-gray-500 max-w-xl text-sm">
                {blogSection.body ?? ""}
              </p>
            </div>
            {blogSection.button ? (
              <Button
                asChild
                variant="outline"
                className="rounded-full flex-shrink-0"
              >
                <Link
                  href={blogSection.button.href}
                  className="flex items-center gap-2"
                >
                  {blogSection.button.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {blogLoading ? (
              /* Loading skeleton */
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 animate-pulse overflow-hidden"
                >
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : apiPosts.length > 0 ? (
              apiPosts.map((post) => <BlogCard key={post.id} post={post} />)
            ) : (
              <BlogEmptyState />
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
            {cta.title ?? "Ready to Start Your Project?"}
          </h2>
          <p className="mt-3 text-secondary-foreground/80 max-w-lg mx-auto text-sm leading-relaxed">
            {cta.body ?? ""}
          </p>
          {cta.button ? (
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-10"
              variant="default"
            >
              <Link href={cta.button.href}>{cta.button.title}</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
