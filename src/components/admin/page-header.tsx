import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

export function AdminPageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className,
}: {
  breadcrumbs?: AdminBreadcrumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'dark text-foreground flex flex-col gap-2 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((b, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                const content = b.href && !isLast ? (
                  <Link href={b.href} className="hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-foreground/90' : undefined}>{b.label}</span>
                );

                return (
                  <li key={`${b.label}-${idx}`} className="flex items-center gap-1">
                    {content}
                    {!isLast ? <span className="text-muted-foreground/60">/</span> : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
