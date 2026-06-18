"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Item } from "@/models/content";
import { useState } from "react";
import { getProductSlides, getProductSlugByIndex } from "@/lib/product-images";
import { Button } from "@/components/ui/button";

function ProductImageCarousel({
  item,
  catalogueItems,
}: {
  item: Item;
  catalogueItems: Item[];
}) {
  const slides = getProductSlides(item, catalogueItems);
  const [index, setIndex] = useState(0);
  const multi = slides.length > 1;
  const imageUrl = slides[index] ?? item.image ?? "/images/placeholder.jpg";

  return (
    <div className="overflow-hidden rounded-t-3xl bg-gray-100">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={`${item.title} ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />

        {multi ? (
          <>
            <button
              type="button"
              onClick={() =>
                setIndex((current) =>
                  current === 0 ? slides.length - 1 : current - 1,
                )
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setIndex((current) =>
                  current === slides.length - 1 ? 0 : current + 1,
                )
              }
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
              {slides.map((slide, dotIndex) => (
                <button
                  key={`${slide}-${dotIndex}`}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Show image ${dotIndex + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    dotIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ProductCard({
  item,
  catalogueItems,
  itemIndex,
}: {
  item: Item;
  catalogueItems: Item[];
  itemIndex: number;
}) {
  const slug = getProductSlugByIndex(item, catalogueItems, itemIndex);

  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-primary/25 transition hover:border-primary/50">
      <ProductImageCarousel item={item} catalogueItems={catalogueItems} />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        {item.body ? (
          <p className="mt-2 text-sm text-gray-500 line-clamp-3">{item.body}</p>
        ) : null}
        <Link
          href={`/products/${slug}`}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { siteContent } = useAppSelector((s) => s.content.content);

  const heroBanner = siteContent?.products?.section1 ?? {};
  const catalogue = siteContent?.products?.section2 ?? {};
  const cta = siteContent?.products?.section3 ?? {};

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-secondary pt-16">
        {heroBanner.image ? (
          <div className="absolute inset-0">
            <Image
              src={heroBanner.image}
              alt={heroBanner.title ?? "Our Products"}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-secondary/80" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="relative text-center px-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-secondary-foreground tracking-tight">
            {heroBanner.title ?? "Our Products"}
          </h1>
          {heroBanner.subtitle && (
            <p className="mt-3 text-secondary-foreground/85 text-sm sm:text-base">
              {heroBanner.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── PRODUCT CATALOGUE ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto container px-6">
          {catalogue.body && (
            <p className="text-center text-gray-500 text-sm max-w-2xl mx-auto mb-10">
              {catalogue.body}
            </p>
          )}
          {(catalogue.items ?? []).length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {(catalogue.items ?? []).map((item, itemIndex) => (
                <ProductCard
                  key={`${item.title}-${itemIndex}`}
                  item={item}
                  itemIndex={itemIndex}
                  catalogueItems={catalogue.items ?? []}
                />
              ))}
            </div>
          )}
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
          {cta.button && (
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-10"
              variant="default"
            >
              <Link href={cta.button.href}>{cta.button.title}</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
