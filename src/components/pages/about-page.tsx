"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Truck, Users, Star } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Item } from "@/models/content";

// ─── Icon map (same keys as homepage) ───────────────────────────────────────
const SECTION_ICONS: Record<string, React.ReactNode> = {
  shield: <Shield className="h-5 w-5" />,
  truck: <Truck className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
};

// ─── Stat Card (same style as homepage) ─────────────────────────────────────
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

// ─── Mission/Vision/Advantages card ─────────────────────────────────────────
function InfoCard({ item }: { item: Item }) {
  const icon = item.subtitle ? (SECTION_ICONS[item.subtitle] ?? null) : null;
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary mt-0.5">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-primary text-base mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
      </div>
    </div>
  );
}

// ─── Main AboutPage ──────────────────────────────────────────────────────────
export default function AboutPage() {
  const { siteContent } = useAppSelector((s) => s.content.content);

  const heroBanner = siteContent?.about?.section1 ?? {};
  const whoWeAre = siteContent?.about?.section2 ?? {};
  const futureOutlook = siteContent?.about?.section3 ?? {};
  const missionVision = siteContent?.about?.section4 ?? {};
  const statsSection = siteContent?.about?.section5 ?? {};
  const cta = siteContent?.about?.section6 ?? {};

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-secondary pt-16">
        {heroBanner.image ? (
          <div className="absolute inset-0">
            <Image
              src={heroBanner.image}
              alt={heroBanner.title ?? "About Ridmax Steel"}
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
            {heroBanner.title ?? "About Ridmaxsteel"}
          </h1>
          {heroBanner.subtitle ? (
            <p className="mt-3 text-secondary-foreground/85 text-sm sm:text-base">
              {heroBanner.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── WHO WE ARE ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto container px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Text */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                {whoWeAre.title ?? "Who We Are"}
              </h2>
              {/* Support multi-paragraph bodies separated by \n */}
              <div className="space-y-4">
                {(whoWeAre.body ?? "")
                  .split("\n")
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-gray-600 text-sm leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {/* Image */}
            {whoWeAre.image ? (
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-100 aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
                <Image
                  src={whoWeAre.image}
                  alt={whoWeAre.title ?? "Who We Are"}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── OUR FUTURE OUTLOOK ──────────────────────────────────────────── */}
      {futureOutlook.body ? (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto container px-6 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
              {futureOutlook.title ?? "Our Future Outlook"}
            </h2>
            <div className="space-y-4">
              {(futureOutlook.body ?? "")
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── MISSION / VISION / ADVANTAGES ───────────────────────────────── */}
      {(missionVision.items ?? []).length > 0 ? (
        <section className="py-20 bg-white">
          <div className="mx-auto container px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: photo */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-100 aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
                <Image
                  src="/images/Ridmax-about/img3.png"
                  alt="Ridmax Steel storefront"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Right: info cards */}
              <div className="space-y-8">
                {(missionVision.items ?? []).map((item) => (
                  <InfoCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── STATS ROW ────────────────────────────────────────────────────── */}
      {(statsSection.items ?? []).length > 0 ? (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto container px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {(statsSection.items ?? []).map((item) => (
                <StatCard key={item.title} item={item} />
              ))}
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
