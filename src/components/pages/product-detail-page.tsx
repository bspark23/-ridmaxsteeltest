"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { Item } from "@/models/content";
import { getProductSlides } from "@/lib/product-images";
import { useAppSelector } from "@/store/hooks";

interface ProductDetailPageProps {
  item: Item;
  relatedItems: Item[];
  catalogueItems: Item[];
}

function WhatsAppModal({
  open,
  onClose,
  agents,
}: {
  open: boolean;
  onClose: () => void;
  agents: { title: string; href: string }[];
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100svh-3rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-primary/15 bg-white p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-1 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-bold text-gray-900">Choose a contact</h3>
        </div>
        <p className="mb-5 text-sm text-gray-500">
          Select which agent you would like to chat with on WhatsApp.
        </p>
        <div className="space-y-3">
          {agents.map((agent) => (
            <a
              key={agent.href}
              href={agent.href}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 transition-colors hover:bg-green-100"
              onClick={onClose}
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {agent.title}
              </span>
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-center text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  item,
  catalogueItems,
}: ProductDetailPageProps) {
  const slides = getProductSlides(item, catalogueItems);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [waOpen, setWaOpen] = useState(false);
  const { siteContent } = useAppSelector(
    (state) => state.content.content,
  );
  const cta = siteContent?.products?.section3;
  const waAgents = (siteContent?.contact?.section2?.buttons ?? []).map(
    (button) => ({
      title: button.title,
      href: `${button.href}?text=${encodeURIComponent(
        `I am interested in ${item.title}`,
      )}`,
    }),
  );
  const displaySlides =
    slides.length > 0 ? slides : [item.image ?? "/images/placeholder.jpg"];
  const safeSelectedIndex = Math.min(selectedIndex, displaySlides.length - 1);
  const maxThumbnailStart = Math.max(displaySlides.length - 4, 0);
  const safeThumbnailStart = Math.min(thumbnailStart, maxThumbnailStart);
  const visibleThumbnails = displaySlides.slice(
    safeThumbnailStart,
    safeThumbnailStart + 4,
  );

  function shiftThumbnails(direction: -1 | 1) {
    setThumbnailStart((current) => {
      const next = current + direction;
      return Math.min(Math.max(next, 0), maxThumbnailStart);
    });
  }

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="bg-white pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto container px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[104px_minmax(0,1fr)] lg:items-start xl:grid-cols-[104px_minmax(0,1fr)_minmax(220px,0.42fr)]">
            <div className="flex items-center gap-3 lg:block">
              {displaySlides.length > 4 ? (
                <button
                  type="button"
                  onClick={() => shiftThumbnails(-1)}
                  disabled={safeThumbnailStart === 0}
                  aria-label="Show previous thumbnails"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35 lg:mx-auto lg:mb-3"
                >
                  <ChevronLeft className="h-5 w-5 lg:hidden" />
                  <ChevronUp className="hidden h-5 w-5 lg:block" />
                </button>
              ) : null}

              <div className="grid flex-1 grid-cols-4 gap-3 lg:grid-cols-1 lg:gap-6">
                {visibleThumbnails.map((slide, visibleIndex) => {
                  const index = safeThumbnailStart + visibleIndex;

                  return (
                    <button
                      key={`${slide}-${index}`}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`relative aspect-[1.45/1] min-w-0 overflow-hidden rounded-2xl bg-[#9bbbe0] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 lg:aspect-[1.48/1] ${
                        safeSelectedIndex === index
                          ? "ring-2 ring-secondary ring-offset-2"
                          : "hover:ring-2 hover:ring-primary/20 hover:ring-offset-2"
                      }`}
                      aria-label={`View ${item.title} image ${index + 1}`}
                    >
                      <Image
                        src={slide}
                        alt={`${item.title} thumbnail ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 104px, 25vw"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {displaySlides.length > 4 ? (
                <button
                  type="button"
                  onClick={() => shiftThumbnails(1)}
                  disabled={safeThumbnailStart >= maxThumbnailStart}
                  aria-label="Show next thumbnails"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35 lg:mx-auto lg:mt-3"
                >
                  <ChevronRight className="h-5 w-5 lg:hidden" />
                  <ChevronDown className="hidden h-5 w-5 lg:block" />
                </button>
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={displaySlides[safeSelectedIndex]}
                  alt={`${item.title} ${safeSelectedIndex + 1}`}
                  fill
                  priority
                  sizes="(min-width: 1280px) 936px, (min-width: 1024px) calc(100vw - 260px), 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="pt-1 lg:col-span-2 lg:pt-0 xl:col-span-1">
              <h1 className="text-xl font-extrabold uppercase leading-none tracking-tight text-primary sm:text-2xl lg:text-[1.35rem]">
                {item.title}
              </h1>
              <p className="mt-3 text-xs font-semibold uppercase leading-tight text-primary/75">
                {item.body}
              </p>

              <div className="mt-8 grid gap-5">
                <button
                  type="button"
                  onClick={() => setWaOpen(true)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#05a83f] px-8 text-xs font-bold text-white transition hover:bg-[#048f36]"
                >
                  Start WhatsApp Chat
                </button>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-xs font-bold text-white transition hover:bg-primary/90"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 sm:py-24">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            {cta?.title ?? "Ready to Start Your Project?"}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-relaxed text-primary/80">
            {cta?.body ??
              "Get in touch with our team today for competitive pricing and expert product consultation."}
          </p>
          <Link
            href={cta?.button?.href ?? "/contact"}
            className="mt-10 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-9 text-sm font-bold text-white transition hover:bg-primary/90"
          >
            {cta?.button?.title ?? "Contact Us Now"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <WhatsAppModal
        open={waOpen}
        onClose={() => setWaOpen(false)}
        agents={waAgents}
      />
    </div>
  );
}
