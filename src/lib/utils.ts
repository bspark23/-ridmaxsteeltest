import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function asNumber(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function slugify(value: string) {
  const normalized = (value ?? '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'item';
}

export function fCurrency(
  value: number | null | undefined,
  options?: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
) {
  const locale = options?.locale ?? 'en-NG';
  const currency = options?.currency ?? 'NGN';
  const numeric =
    typeof value === 'number' && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(numeric);
}

export function statusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
    case 'occupied':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
    case 'dirty':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
    case 'cleaning':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
    case 'maintenance':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/20';
    case 'out_of_order':
      return 'bg-red-500/15 text-red-400 border-red-500/20';
    case 'neutral':
      return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20';
    default:
      return '';
  }
}
