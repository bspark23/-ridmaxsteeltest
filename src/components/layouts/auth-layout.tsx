'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

type Slide = { id: string; title: string; description: string; image: string };

function fallbackSlides(): Slide[] {
  return [
    {
      id: 'slide-1',
      title: "Nigeria's Trusted Steel Partner",
      description:
        'Ridmax Steel supplies premium quality steel products for construction, manufacturing, and infrastructure development across Nigeria.',
      image: '/images/Ridmax-our-services/slide.png',
    },
    {
      id: 'slide-2',
      title: 'Quality Steel, Reliable Delivery',
      description:
        'From iron rods and roofing sheets to hollow sections and pipes — we stock everything your project needs.',
      image: '/images/Ridmax-home/home/img1.png',
    },
    {
      id: 'slide-3',
      title: 'Expert Fabrication & Technical Support',
      description:
        'Our certified team provides welding, fabrication, and technical consultation services tailored to your needs.',
      image: '/images/Ridmax-our-services/welding&fabrication.png',
    },
  ];
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { systemSettings } = useAppSelector((s) => s.content.content);
  const slides = fallbackSlides();

  useEffect(() => {
    const t = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const active = slides[activeIndex] ?? slides[0];

  return (
    <div className='min-h-svh bg-background text-foreground'>
      <div className='grid min-h-svh lg:grid-cols-2'>
        <div className='relative hidden overflow-hidden border-r lg:block'>
          <Image
            src={active.image}
            alt={active.title}
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.14),transparent_55%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.25),rgba(0,0,0,0.75))]' />

          <div className='relative flex h-full flex-col p-10'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/images/logo-white.svg'
                alt={systemSettings?.siteName ?? ''}
                width={170}
                height={40}
                className='h-10 w-auto'
              />
            </Link>

            <div className='flex-1' />

            <div className='pointer-events-none relative -mb-6 mt-10'>
              <div className='pointer-events-auto inline-flex max-w-[34rem] flex-col gap-2 rounded-2xl border border-white/15 bg-black/35 p-6 backdrop-blur-xl'>
                <div className='text-2xl font-semibold tracking-tight text-white'>
                  {active.title}
                </div>
                <div className='max-h-24 overflow-auto pr-1 text-sm leading-relaxed text-white/80'>
                  {active.description}
                </div>
              </div>
            </div>

            <div className='mt-12 flex items-center gap-2'>
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  className={cn(
                    'h-1.5 w-8 rounded-full transition-all',
                    idx === activeIndex
                      ? 'bg-primary'
                      : 'bg-white/30 hover:bg-white/40',
                  )}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className='mt-6 text-xs text-white/70'>
              © {new Date().getFullYear()} {systemSettings?.siteName ?? ''}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center p-6'>
          <div className='w-full max-w-md'>{children}</div>
        </div>
      </div>
    </div>
  );
}
