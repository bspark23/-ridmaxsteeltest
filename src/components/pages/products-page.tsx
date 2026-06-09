'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Item } from '@/models/content';

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ item }: { item: Item }) {
  return (
    <div className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100'>
      {/* Image */}
      <div className='relative w-full aspect-[4/3] bg-gray-100 overflow-hidden'>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            className='object-cover group-hover:scale-105 transition-transform duration-500'
          />
        ) : null}
      </div>

      {/* Info */}
      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 text-sm leading-snug'>
          {item.title}
        </h3>
        <p className='mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed'>
          {item.body}
        </p>
        {/* Contact Us link */}
        <Link
          href='/contact'
          className='mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors'
        >
          Contact Us <ArrowRight className='h-3 w-3' />
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
    <div className='overflow-x-hidden'>
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className='relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-primary pt-16'>
        {heroBanner.image ? (
          <div className='absolute inset-0'>
            <Image
              src={heroBanner.image}
              alt={heroBanner.title ?? 'Our Products'}
              fill
              priority
              sizes='100vw'
              className='object-cover object-center'
            />
            <div className='absolute inset-0 bg-primary/70' />
          </div>
        ) : (
          <div className='absolute inset-0 bg-primary' />
        )}
        <div className='relative text-center px-6'>
          <h1 className='text-3xl sm:text-5xl font-bold text-white tracking-tight'>
            {heroBanner.title ?? 'Our Products'}
          </h1>
          {heroBanner.subtitle ? (
            <p className='mt-3 text-white/80 text-sm sm:text-base'>
              {heroBanner.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── PRODUCT CATALOGUE ────────────────────────────────────────────── */}
      <section className='py-16 bg-white'>
        <div className='mx-auto container px-6'>
          {/* Section header */}
          {catalogue.body ? (
            <p className='text-center text-gray-500 text-sm max-w-2xl mx-auto mb-10'>
              {catalogue.body}
            </p>
          ) : null}

          {/* 3-column responsive grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>
            {(catalogue.items ?? []).map((item, i) => (
              <ProductCard key={`${item.title}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className='py-20 bg-secondary'>
        <div className='mx-auto container px-6 text-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-secondary-foreground'>
            {cta.title ?? 'Ready to Start Your Project?'}
          </h2>
          <p className='mt-3 text-secondary-foreground/80 max-w-lg mx-auto text-sm leading-relaxed'>
            {cta.body ?? ''}
          </p>
          {cta.button ? (
            <Button
              asChild
              size='lg'
              className='mt-8 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-10'
              variant='default'
            >
              <Link href={cta.button.href}>{cta.button.title}</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
