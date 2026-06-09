"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Item } from "@/models/content";

// ─── Service Row — alternating image/text layout ──────────────────────────────
function ServiceRow({ item, index }: { item: Item; index: number }) {
  const isEven = index % 2 === 0; // even → image left; odd → image right

  // Split bullet points from item.buttons
  const features = item.buttons ?? [];
  const half = Math.ceil(features.length / 2);
  const col1 = features.slice(0, half);
  const col2 = features.slice(half);

  return (
    <div className="py-14 border-b border-gray-100 last:border-0">
      <div className="mx-auto container px-6">
        <div
          className={`grid lg:grid-cols-2 gap-10 items-center ${
            !isEven ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`relative w-full rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100 ${!isEven ? "lg:col-start-2" : ""}`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Text */}
          <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
            {/* Numbered badge */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm mb-4">
              {item.subtitle ?? String(index + 1).padStart(2, "0")}
            </div>

            <h2 className="text-2xl font-bold text-primary mb-3">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {item.body}
            </p>

            {/* Feature bullet grid */}
            {features.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {[...col1, ...col2].map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-snug">
                      {f.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Who We Serve row item ────────────────────────────────────────────────────
function ServeItem({ item, isLast }: { item: Item; isLast: boolean }) {
  return (
    <div className={`py-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <h4 className="font-bold text-primary text-sm mb-0.5">{item.title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
    </div>
  );
}

// ─── Main ServicesPage ────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { siteContent } = useAppSelector((s) => s.content.content);

  const hero = siteContent?.services?.section1 ?? {};
  const servicesList = siteContent?.services?.section2 ?? {};
  const whoWeServe = siteContent?.services?.section3 ?? {};
  const cta = siteContent?.services?.section4 ?? {};

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-secondary pt-16">
        {hero.image ? (
          <div className="absolute inset-0">
            <Image
              src={hero.image}
              alt={hero.title ?? "Our Services"}
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
            {hero.title ?? "Our Services"}
          </h1>
          {hero.subtitle ? (
            <p className="mt-3 text-secondary-foreground/85 text-sm sm:text-base max-w-xl mx-auto">
              {hero.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── SERVICE ROWS ─────────────────────────────────────────────────── */}
      <section className="bg-white">
        {(servicesList.items ?? []).map((item, i) => (
          <ServiceRow key={item.title} item={item} index={i} />
        ))}
      </section>

      {/* ── WHO WE SERVE ─────────────────────────────────────────────────── */}
      {(whoWeServe.items ?? []).length > 0 ? (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto container px-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: image */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-gray-100">
                {whoWeServe.image ? (
                  <Image
                    src={whoWeServe.image}
                    alt={whoWeServe.title ?? "Who We Serve"}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center"
                  />
                ) : null}
              </div>

              {/* Right: client list */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {whoWeServe.title ?? "Who We Serve"}
                </h2>
                {whoWeServe.subtitle ? (
                  <p className="text-gray-500 text-sm mb-6">
                    {whoWeServe.subtitle}
                  </p>
                ) : null}
                <div>
                  {(whoWeServe.items ?? []).map((item, i, arr) => (
                    <ServeItem
                      key={item.title}
                      item={item}
                      isLast={i === arr.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
              className="mt-8 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-10"
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
