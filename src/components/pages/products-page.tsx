"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Item } from "@/models/content";
import { useState, useEffect } from "react";

// ─── Product image map — add images for any product by its exact title (lowercase) ───
// The key is the product title in lowercase. Add as many entries as needed.
// Products without an entry here will show their single `image` from the API.
const PRODUCT_IMAGES: Record<string, string[]> = {
  "brush materials": [
    "/images/brush material/_KOS6404.jpg",
    "/images/brush material/_KOS6405.jpg",
    "/images/brush material/_KOS6406.jpg",
    "/images/brush material/_KOS8726.jpg",
    "/images/brush material/_KOS8728.jpg",
    "/images/brush material/_KOS8730.jpg",
  ],
  "angle materials": [
    "/images/angle materials/_KOS8847.jpg",
    "/images/angle materials/_KOS8853.jpg",
    "/images/angle materials/_KOS8877 copy.jpg",
    "/images/angle materials/_KOS8887.jpg",
  ],
  "checker materials": [
    "/images/Cheacker Materials/_KOS8674.jpg",
    "/images/Cheacker Materials/_KOS8682.jpg",
    "/images/Cheacker Materials/_KOS8689.jpg",
    "/images/Cheacker Materials/_KOS8690.jpg",
  ],
  "flat bar materials": [
    "/images/flatbar/_KOS8894.jpg",
    "/images/flatbar/_KOS8896.jpg",
  ],
  "galvanise steel product": [
    "/images/gaiva/_KOS6495.jpg",
    "/images/gaiva/_KOS6498.jpg",
    "/images/gaiva/_KOS6499.jpg",
    "/images/gaiva/_KOS6502.jpg",
    "/images/gaiva/_KOS6503.jpg",
    "/images/gaiva/_KOS6504.jpg",
    "/images/gaiva/_KOS6505.jpg",
    "/images/gaiva/_KOS6506.jpg",
    "/images/gaiva/_KOS6507.jpg",
    "/images/gaiva/_KOS6508.jpg",
    "/images/gaiva/_KOS6509.jpg",
  ],
  "mild steel product":[
"/images/mild/_KOS6543.jpg",
  "/images/mild/_KOS6534.jpg",
    "/images/mild/_KOS6544.jpg",
    "/images/mild/_KOS6579.jpg",
    "/images/mild/_KOS6580.jpg",
    "/images/mild/_KOS6583.jpg",
    "/images/mild/_KOS6584.jpg",
    "/images/mild/_KOS6587.jpg",
    "/images/mild/_KOS6588.jpg",
    "/images/mild/_KOS6590.jpg",
    "/images/mild/_KOS6593.jpg",
    "/images/mild/_KOS6594.jpg",
    "/images/mild/_KOS6595.jpg",
    "/images/mild/_KOS6601.jpg",
    "/images/mild/_KOS6602.jpg",
    "/images/mild/_KOS6605.jpg",
  ],

  "mirror black":[
    "/images/Mirror/_KOS6410.jpg",
    "/images/Mirror/_KOS6417.jpg",
    "/images/Mirror/_KOS8707.jpg",
    "/images/Mirror/_KOS8709.jpg",
  ],

  "mirror blue":[
     "/images/blue/_KOS6479.jpg",
     "/images/blue/_KOS6481.jpg"
    
  ],

  "mirror gold":[
     "/images/gold/_KOS6419.jpg",
     "/images/gold/_KOS6422.jpg",
     "/images/gold/_KOS8692.jpg",
     "/images/gold/_KOS8699.jpg",
    
  ],  

    "mirror stainless sheet":[
     "/images/stainless/_KOS8719.jpg",
  "/images/stainless/_KOS8720.jpg",
    
  ],  

  
   "perforated materials":[
     "/images/perforated/_KOS8772.jpg",
  "/images/perforated/_KOS8781.jpg",
  "/images/perforated/_KOS8782.jpg",
    
  ],  

   "solid rod materials":[
     "/images/solid/_KOS8902.jpg",
  "/images/solid/_KOS8905.jpg",
  "/images/solid/_KOS8906.jpg",                                                                                                                                        "/images/solid/_KOS8932.jpg",
  "/images/solid/_KOS8935.jpg",
    "/images/solid/_KOS8932.jpg",
    "/images/solid/_KOS8936.jpg"
  ],  
    
  "stainless round pipe":[
     "/images/spipe/_KOS8743.jpg",
  "/images/spipe/_KOS8747.jpg",
  "/images/spipe/_KOS8750.jpg",                                                                                                                                       
  ], 

  "stainless square pipe":[
     "/images/square/_KOS8916.jpg",
  "/images/square/_KOS8919.jpg",
  "/images/square/_KOS8920.jpg", 
    "/images/square/_KOS8940.jpg",  
    "/images/square/_KOS8942.jpg"                                                                                                                                                                                                                                                                           
  ],  

 "stainless steel accessories":[
    "/images/accessories/_KOS8791.jpg",
    "/images/accessories/_KOS8797.jpg",
    "/images/accessories/_KOS8801 copy.jpg",
    "/images/accessories/_KOS8806.jpg",
    "/images/accessories/_KOS8810 copy.jpg",
    "/images/accessories/_KOS8814.jpg",
    "/images/accessories/_KOS8820.jpg",
    "/images/accessories/_KOS8821.jpg",
    "/images/accessories/_KOS8824.jpg",
    "/images/accessories/_KOS8827.jpg",
    "/images/accessories/_KOS8828.jpg",
    "/images/accessories/_KOS8832.jpg",
    "/images/accessories/_KOS8833.jpg",
    "/images/accessories/_KOS8835.jpg",
    "/images/accessories/_KOS8836.jpg",
    "/images/accessories/_KOS8838.jpg",
  ],  

  // Add more products below in the same format:
  // "hollow materials product": ["/images/...", "/images/..."],
};

// Resolve slides for a product — prefer API images, then static map, then single image
function getSlides(item: Item): string[] {
  if (item.images && item.images.length > 1) return item.images;
  const mapped = PRODUCT_IMAGES[item.title.toLowerCase().trim()];
  if (mapped && mapped.length > 0) return mapped;
  if (item.image) return [item.image];
  return [];
}

// ─── Image carousel ───────────────────────────────────────────────────────────
function ProductImageCarousel({ item }: { item: Item }) {
  const slides = getSlides(item);
  const [index, setIndex] = useState(0);
  const multi = slides.length > 1;

  // Auto-advance every 3 s
  useEffect(() => {
    if (!multi) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, [multi, slides.length]);

  if (slides.length === 0) return <div className="w-full aspect-[4/3] bg-gray-100" />;

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden select-none">
      {/* Slides */}
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={src}
            alt={`${item.title} ${i + 1}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Controls — only for multi-image */}
      {multi && (
        <>
          {/* Prev */}
          <button
            onClick={(e) => { e.preventDefault(); setIndex((i) => (i - 1 + slides.length) % slides.length); }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.preventDefault(); setIndex((i) => (i + 1) % slides.length); }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setIndex(i); }}
                aria-label={`Image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {index + 1}/{slides.length}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ item }: { item: Item }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-primary/15 transition-colors hover:border-primary/25">
      <ProductImageCarousel item={item} />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.body}</p>
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors"
        >
          Contact Us <ArrowRight className="h-3 w-3" />
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
            <Image src={heroBanner.image} alt={heroBanner.title ?? "Our Products"} fill priority sizes="100vw" className="object-cover object-center" />
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
            <p className="mt-3 text-secondary-foreground/85 text-sm sm:text-base">{heroBanner.subtitle}</p>
          )}
        </div>
      </section>

      {/* ── PRODUCT CATALOGUE ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto container px-6">
          {catalogue.body && (
            <p className="text-center text-gray-500 text-sm max-w-2xl mx-auto mb-10">{catalogue.body}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {(catalogue.items ?? []).map((item, i) => (
              <ProductCard key={`${item.title}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
            {cta.title ?? "Ready to Start Your Project?"}
          </h2>
          <p className="mt-3 text-secondary-foreground/80 max-w-lg mx-auto text-sm leading-relaxed">{cta.body ?? ""}</p>
          {cta.button && (
            <Button asChild size="lg" className="mt-8 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-10" variant="default">
              <Link href={cta.button.href}>{cta.button.title}</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
