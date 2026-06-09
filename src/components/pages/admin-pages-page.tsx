'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AppWindow, Pencil, Plus, Save, Trash2 } from 'lucide-react';

import type { Button as ContentButton, Item, Section, SiteContent } from '@/models/content';
import type { Media } from '@/models/media';
import { hasAnyPermission } from '@/components/admin/admin-nav';
import { MediaManager } from '@/components/admin/media-manager';
import { PageItemModal } from '@/components/admin/page-item-modal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSiteContent } from '@/store/slices/content-slice';

function toMedia(url: string | undefined, type: Media['type']): Media | null {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return null;
  return { url: trimmed, type, alt: '' };
}

function titleCaseFromKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function labelForSectionKey(key: string) {
  const match = key.match(/^section(\d+)$/i);
  if (match?.[1]) return `Section ${match[1]}`;
  return titleCaseFromKey(key);
}

function isTimestampKey(key: string) {
  return key.trim().toLowerCase() === 'updatedat';
}

function emptyItem(): Item {
  return {
    title: '',
    body: '',
    subtitle: '',
    image: '',
    video: '',
    thumbnail: '',
    href: '',
    button: undefined,
    buttons: undefined,
  };
}

function normalizeButton(btn: ContentButton | undefined) {
  if (!btn) return undefined;
  const title = btn.title?.trim() || '';
  const href = btn.href?.trim() || '';
  const icon = btn.icon?.trim() || undefined;
  const target = btn.target || undefined;
  if (!title && !href && !icon && !target) return undefined;
  return {
    title,
    href,
    icon,
    target,
  };
}

function normalizeButtons(buttons: ContentButton[] | undefined) {
  const list = (buttons ?? [])
    .map((b) => normalizeButton(b))
    .filter(Boolean) as ContentButton[];
  return list.length ? list : undefined;
}

function normalizeStringList(values: string[] | undefined) {
  const list = (values ?? []).map((v) => v.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeItem(item: Item): Item {
  return {
    ...item,
    title: item.title.trim(),
    body: item.body.trim(),
    subtitle: item.subtitle?.trim() || undefined,
    href: item.href?.trim() || undefined,
    image: item.image?.trim() || undefined,
    thumbnail: item.thumbnail?.trim() || undefined,
    video: item.video?.trim() || undefined,
    button: normalizeButton(item.button),
    buttons: normalizeButtons(item.buttons),
  };
}

function normalizeSection(section: Section): Section {
  const items = (section.items ?? []).map((it) => normalizeItem(it));
  return {
    ...section,
    title: (section.title ?? '').trim(),
    body: (section.body ?? '').trim(),
    subtitle: section.subtitle?.trim() || undefined,
    overline: section.overline?.trim() || undefined,
    background: section.background?.trim() || undefined,
    image: section.image?.trim() || undefined,
    video: section.video?.trim() || undefined,
    images: normalizeStringList(section.images),
    videos: normalizeStringList(section.videos),
    button: normalizeButton(section.button),
    buttons: normalizeButtons(section.buttons),
    items: items.length ? items : undefined,
  };
}

function normalizeSiteContent(input: SiteContent): SiteContent {
  const next: Record<string, unknown> = {};

  for (const [pageKey, pageValue] of Object.entries(input ?? {})) {
    if (isTimestampKey(pageKey)) continue;
    if (!isRecord(pageValue)) {
      next[pageKey] = pageValue;
      continue;
    }

    const nextPage: Record<string, unknown> = {};
    for (const [sectionKey, sectionValue] of Object.entries(pageValue)) {
      if (isTimestampKey(sectionKey)) {
        nextPage[sectionKey] = sectionValue;
        continue;
      }

      const maybeSection = sectionValue as Partial<Section>;
      if (
        isRecord(sectionValue) &&
        typeof maybeSection.title === 'string' &&
        typeof maybeSection.body === 'string'
      ) {
        nextPage[sectionKey] = normalizeSection(sectionValue as Section);
        continue;
      }

      nextPage[sectionKey] = sectionValue;
    }

    next[pageKey] = nextPage;
  }

  return next as SiteContent;
}

export default function AdminPagesPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const siteContent = useAppSelector((s) => s.content.content.siteContent);
  const isLoading = useAppSelector((s) => s.content.isLoading);

  const canManagePages = hasAnyPermission(user, ['page:manage']);

  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalPageKey, setItemModalPageKey] = useState<string>('');
  const [itemModalSectionKey, setItemModalSectionKey] = useState<string>('');
  const [itemModalIndex, setItemModalIndex] = useState<number | null>(null);
  const [itemDraft, setItemDraft] = useState<Item>(emptyItem());

  const content = draft ?? siteContent;

  const pageKeys = useMemo(
    () => Object.keys(content ?? {}).filter((key) => !isTimestampKey(key)),
    [content],
  );
  const activePageKey = useMemo(() => {
    if (selectedPage && pageKeys.includes(selectedPage)) return selectedPage;
    return pageKeys[0] ?? '';
  }, [pageKeys, selectedPage]);

  const sections = useMemo(() => {
    const page = activePageKey ? content[activePageKey] : undefined;
    const entries = Object.entries(page ?? {}).filter(
      ([key]) => !isTimestampKey(key),
    ) as Array<[string, Section]>;
    return entries;
  }, [activePageKey, content]);

  const isDirty = useMemo(() => {
    if (!draft) return false;
    try {
      return JSON.stringify(siteContent) !== JSON.stringify(draft);
    } catch {
      return true;
    }
  }, [draft, siteContent]);

  function updateSection(
    pageKey: string,
    sectionKey: string,
    updater: (current: Section) => Section,
  ) {
    setDraft((prev) => {
      const base = prev ?? siteContent;
      const page = base[pageKey] ?? {};
      const current = page[sectionKey] ?? { title: '', body: '' };
      const nextSection = updater(current);
      return {
        ...base,
        [pageKey]: {
          ...page,
          [sectionKey]: nextSection,
        },
      };
    });
  }

  function openAddItemModal(pageKey: string, sectionKey: string) {
    setItemModalPageKey(pageKey);
    setItemModalSectionKey(sectionKey);
    setItemModalIndex(null);
    setItemDraft(emptyItem());
    setItemModalOpen(true);
  }

  function openEditItemModal(pageKey: string, sectionKey: string, index: number) {
    const current = content?.[pageKey]?.[sectionKey]?.items?.[index];
    setItemModalPageKey(pageKey);
    setItemModalSectionKey(sectionKey);
    setItemModalIndex(index);
    setItemDraft({
      ...emptyItem(),
      ...(current ?? {}),
      title: current?.title ?? '',
      subtitle: current?.subtitle ?? '',
      body: current?.body ?? '',
      image: current?.image ?? '',
      video: current?.video ?? '',
      thumbnail: current?.thumbnail ?? '',
      href: current?.href ?? '',
    });
    setItemModalOpen(true);
  }

  function saveItemModal() {
    const title = itemDraft.title.trim();
    const body = itemDraft.body.trim();
    if (!title || !body) {
      toast.error('Item title and body are required');
      return;
    }

    updateSection(itemModalPageKey, itemModalSectionKey, (current) => {
      const items = [...(current.items ?? [])];
      const nextItem = normalizeItem({ ...itemDraft, title, body });

      if (typeof itemModalIndex === 'number') {
        items[itemModalIndex] = nextItem;
      } else {
        items.push(nextItem);
      }

      return {
        ...current,
        items,
      };
    });

    setItemModalOpen(false);
  }

  function removeItem(pageKey: string, sectionKey: string, index: number) {
    updateSection(pageKey, sectionKey, (current) => {
      const items = [...(current.items ?? [])];
      items.splice(index, 1);
      return { ...current, items: items.length ? items : undefined };
    });
  }

  async function save() {
    if (!canManagePages) return;
    if (!isDirty) return;
    setSaving(true);
    try {
      const nextSiteContent = normalizeSiteContent(draft ?? content);
      await dispatch(
        updateSiteContent(nextSiteContent),
      ).unwrap();
      setDraft(null);
      toast.success('Pages updated');
    } catch {
      toast.error('Failed to update pages');
    } finally {
      setSaving(false);
    }
  }

  if (!canManagePages) {
    return (
      <div className='space-y-4'>
        <div className='space-y-1'>
          <h1 className='text-balance text-2xl font-semibold tracking-tight text-white'>
            Pages
          </h1>
          <p className='text-sm text-white/70'>
            You don&apos;t have access to manage pages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-balance text-2xl font-semibold tracking-tight text-white'>
            Pages
          </h1>
          <p className='text-sm text-white/70'>
            Edit existing pages and their sections.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => setDraft(null)}
            disabled={!isDirty || saving}
          >
            Reset
          </Button>
          <Button type='button' onClick={save} loading={saving} disabled={!isDirty}>
            <Save className='h-4 w-4' />
            Save changes
          </Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-12'>
        <Card className='border-white/10 bg-white/5 lg:col-span-3'>
          <CardHeader className='gap-1'>
            <CardTitle className='flex items-center gap-2 text-white'>
              <div className='inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-white/70 ring-1 ring-white/10'>
                <AppWindow className='h-4 w-4' />
              </div>
              Pages
            </CardTitle>
            <CardDescription className='text-white/70'>
              Pages can be edited but not added.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            {pageKeys.length ? (
              pageKeys.map((key) => {
                const active = key === activePageKey;
                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => setSelectedPage(key)}
                    className={[
                      'w-full rounded-2xl border px-3 py-2 text-left text-sm transition-colors',
                      active
                        ? 'border-white/15 bg-white/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]',
                    ].join(' ')}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='truncate font-medium'>
                        {titleCaseFromKey(key)}
                      </span>
                      {active ? (
                        <Badge
                          variant='secondary'
                          className='bg-white/10 text-white/80'
                        >
                          Editing
                        </Badge>
                      ) : null}
                    </div>
                    <div className='mt-1 text-xs text-white/60'>
                      {Object.keys(content[key] ?? {}).length} sections
                    </div>
                  </button>
                );
              })
            ) : isLoading ? (
              <div className='text-sm text-white/70'>Loading…</div>
            ) : (
              <div className='text-sm text-white/70'>No pages found.</div>
            )}
          </CardContent>
        </Card>

        <div className='space-y-6 lg:col-span-9'>
          <Card className='border-white/10 bg-white/5'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-white'>
                {activePageKey
                  ? titleCaseFromKey(activePageKey)
                  : 'Select a page'}
              </CardTitle>
              <CardDescription className='text-white/70'>
                Sections are keyed as section1, section2, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              {sections.length ? (
                <Accordion type='multiple' className='space-y-3'>
                  {sections.map(([sectionKey, section]) => {
                    const items = section.items ?? [];
                    return (
                      <AccordionItem
                        key={sectionKey}
                        value={sectionKey}
                        className='rounded-2xl border border-white/10 bg-white/[0.02] px-4'
                      >
                        <AccordionTrigger className='py-4 text-left text-white hover:no-underline'>
                          <div className='flex min-w-0 flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                              <span className='truncate font-semibold'>
                                {labelForSectionKey(sectionKey)}
                              </span>
                              <Badge
                                variant='outline'
                                className='border-white/15 text-white/70'
                              >
                                {items.length ? `${items.length} items` : 'No items'}
                              </Badge>
                            </div>
                            <span className='truncate text-xs text-white/60'>
                              {section.title || 'Untitled section'}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='pb-5'>
                          <div className='grid gap-4 lg:grid-cols-12'>
                            <div className='space-y-4 lg:col-span-7'>
                              <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Title
                                  </div>
                                  <Input
                                    value={section.title ?? ''}
                                    onChange={(e) =>
                                      updateSection(
                                        activePageKey,
                                        sectionKey,
                                        (current) => ({
                                          ...current,
                                          title: e.target.value,
                                        }),
                                      )
                                    }
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Subtitle
                                  </div>
                                  <Input
                                    value={section.subtitle ?? ''}
                                    onChange={(e) =>
                                      updateSection(
                                        activePageKey,
                                        sectionKey,
                                        (current) => ({
                                          ...current,
                                          subtitle: e.target.value || undefined,
                                        }),
                                      )
                                    }
                                  />
                                </div>

                                <div className='space-y-2 md:col-span-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Overline
                                  </div>
                                  <Input
                                    value={section.overline ?? ''}
                                    onChange={(e) =>
                                      updateSection(
                                        activePageKey,
                                        sectionKey,
                                        (current) => ({
                                          ...current,
                                          overline: e.target.value || undefined,
                                        }),
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className='space-y-2'>
                                <div className='text-sm font-medium text-white'>
                                  Body
                                </div>
                                <Textarea
                                  value={section.body ?? ''}
                                  onChange={(e) =>
                                    updateSection(
                                      activePageKey,
                                      sectionKey,
                                      (current) => ({
                                        ...current,
                                        body: e.target.value,
                                      }),
                                    )
                                  }
                                  className='min-h-[140px]'
                                />
                              </div>

                              <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Background
                                  </div>
                                  <Input
                                    value={section.background ?? ''}
                                    onChange={(e) =>
                                      updateSection(
                                        activePageKey,
                                        sectionKey,
                                        (current) => ({
                                          ...current,
                                          background: e.target.value || undefined,
                                        }),
                                      )
                                    }
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Video
                                  </div>
                                  <MediaManager
                                    value={toMedia(section.video, 'video')}
                                    onChange={(m) =>
                                      updateSection(
                                        activePageKey,
                                        sectionKey,
                                        (current) => ({
                                          ...current,
                                          video: m?.url || undefined,
                                        }),
                                      )
                                    }
                                    defaultType='video'
                                    triggerLabel={
                                      section.video ? 'Change video' : 'Select video'
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className='space-y-4 lg:col-span-5'>
                              <div className='space-y-3'>
                                <div className='flex items-center justify-between gap-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Image
                                  </div>
                                </div>
                                <MediaManager
                                  value={toMedia(section.image, 'image')}
                                  onChange={(m) =>
                                    updateSection(activePageKey, sectionKey, (current) => ({
                                      ...current,
                                      image: m?.url || undefined,
                                    }))
                                  }
                                  defaultType='image'
                                  triggerLabel={section.image ? 'Change image' : 'Select image'}
                                />
                              </div>

                              <div className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'>
                                <div className='flex items-center justify-between gap-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Images
                                  </div>
                                  <Button
                                    type='button'
                                    size='sm'
                                    variant='secondary'
                                    onClick={() =>
                                      updateSection(activePageKey, sectionKey, (current) => ({
                                        ...current,
                                        images: [...(current.images ?? []), ''],
                                      }))
                                    }
                                  >
                                    <Plus className='h-4 w-4' />
                                    Add image
                                  </Button>
                                </div>
                                <div className='mt-3 space-y-3'>
                                  {(section.images ?? []).length ? (
                                    (section.images ?? []).map((url, index) => (
                                      <div
                                        key={`${sectionKey}-images-${index}`}
                                        className='rounded-2xl border border-white/10 bg-white/[0.03] p-3'
                                      >
                                        <MediaManager
                                          value={toMedia(url, 'image')}
                                          onChange={(m) =>
                                            updateSection(
                                              activePageKey,
                                              sectionKey,
                                              (current) => {
                                                const next = [...(current.images ?? [])];
                                                next[index] = m?.url || '';
                                                return {
                                                  ...current,
                                                  images: next,
                                                };
                                              },
                                            )
                                          }
                                          defaultType='image'
                                          triggerLabel={url ? 'Change image' : 'Select image'}
                                        />
                                        <div className='mt-2 flex justify-end'>
                                          <Button
                                            type='button'
                                            size='sm'
                                            variant='secondary'
                                            onClick={() =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => {
                                                  const next = [...(current.images ?? [])];
                                                  next.splice(index, 1);
                                                  return {
                                                    ...current,
                                                    images: next.length ? next : undefined,
                                                  };
                                                },
                                              )
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className='text-sm text-white/70'>
                                      No images yet.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'>
                                <div className='flex items-center justify-between gap-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Videos
                                  </div>
                                  <Button
                                    type='button'
                                    size='sm'
                                    variant='secondary'
                                    onClick={() =>
                                      updateSection(activePageKey, sectionKey, (current) => ({
                                        ...current,
                                        videos: [...(current.videos ?? []), ''],
                                      }))
                                    }
                                  >
                                    <Plus className='h-4 w-4' />
                                    Add video
                                  </Button>
                                </div>
                                <div className='mt-3 space-y-3'>
                                  {(section.videos ?? []).length ? (
                                    (section.videos ?? []).map((url, index) => (
                                      <div
                                        key={`${sectionKey}-videos-${index}`}
                                        className='rounded-2xl border border-white/10 bg-white/[0.03] p-3'
                                      >
                                        <MediaManager
                                          value={toMedia(url, 'video')}
                                          onChange={(m) =>
                                            updateSection(
                                              activePageKey,
                                              sectionKey,
                                              (current) => {
                                                const next = [...(current.videos ?? [])];
                                                next[index] = m?.url || '';
                                                return {
                                                  ...current,
                                                  videos: next,
                                                };
                                              },
                                            )
                                          }
                                          defaultType='video'
                                          triggerLabel={url ? 'Change video' : 'Select video'}
                                        />
                                        <div className='mt-2 flex justify-end'>
                                          <Button
                                            type='button'
                                            size='sm'
                                            variant='secondary'
                                            onClick={() =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => {
                                                  const next = [...(current.videos ?? [])];
                                                  next.splice(index, 1);
                                                  return {
                                                    ...current,
                                                    videos: next.length ? next : undefined,
                                                  };
                                                },
                                              )
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className='text-sm text-white/70'>
                                      No videos yet.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'>
                                <div className='flex items-center justify-between gap-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Buttons
                                  </div>
                                  <Button
                                    type='button'
                                    size='sm'
                                    variant='secondary'
                                    onClick={() =>
                                      updateSection(activePageKey, sectionKey, (current) => ({
                                        ...current,
                                        buttons: [...(current.buttons ?? []), { title: '', href: '' }],
                                      }))
                                    }
                                  >
                                    <Plus className='h-4 w-4' />
                                    Add button
                                  </Button>
                                </div>

                                <div className='mt-3 space-y-3'>
                                  <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-3'>
                                    <div className='flex items-center justify-between gap-2'>
                                      <div className='text-sm font-medium text-white'>
                                        Primary button
                                      </div>
                                      {section.button ? (
                                        <Button
                                          type='button'
                                          size='sm'
                                          variant='secondary'
                                          onClick={() =>
                                            updateSection(
                                              activePageKey,
                                              sectionKey,
                                              (current) => ({
                                                ...current,
                                                button: undefined,
                                              }),
                                            )
                                          }
                                        >
                                          Clear
                                        </Button>
                                      ) : (
                                        <Button
                                          type='button'
                                          size='sm'
                                          variant='secondary'
                                          onClick={() =>
                                            updateSection(
                                              activePageKey,
                                              sectionKey,
                                              (current) => ({
                                                ...current,
                                                button: { title: '', href: '' },
                                              }),
                                            )
                                          }
                                        >
                                          Add
                                        </Button>
                                      )}
                                    </div>

                                    {section.button ? (
                                      <div className='mt-3 grid gap-3 md:grid-cols-2'>
                                        <div className='space-y-2'>
                                          <div className='text-sm font-medium text-white'>
                                            Label
                                          </div>
                                          <Input
                                            value={section.button.title ?? ''}
                                            onChange={(e) =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => ({
                                                  ...current,
                                                  button: {
                                                    title: e.target.value,
                                                    href: current.button?.href ?? '',
                                                    icon: current.button?.icon,
                                                    target: current.button?.target,
                                                  },
                                                }),
                                              )
                                            }
                                          />
                                        </div>
                                        <div className='space-y-2'>
                                          <div className='text-sm font-medium text-white'>
                                            URL
                                          </div>
                                          <Input
                                            value={section.button.href ?? ''}
                                            onChange={(e) =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => ({
                                                  ...current,
                                                  button: {
                                                    title: current.button?.title ?? '',
                                                    href: e.target.value,
                                                    icon: current.button?.icon,
                                                    target: current.button?.target,
                                                  },
                                                }),
                                              )
                                            }
                                          />
                                        </div>
                                        <div className='space-y-2'>
                                          <div className='text-sm font-medium text-white'>
                                            Icon
                                          </div>
                                          <Input
                                            value={section.button.icon ?? ''}
                                            onChange={(e) =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => ({
                                                  ...current,
                                                  button: {
                                                    title: current.button?.title ?? '',
                                                    href: current.button?.href ?? '',
                                                    icon: e.target.value || undefined,
                                                    target: current.button?.target,
                                                  },
                                                }),
                                              )
                                            }
                                          />
                                        </div>
                                        <div className='space-y-2'>
                                          <div className='text-sm font-medium text-white'>
                                            Target
                                          </div>
                                          <Select
                                            value={section.button?.target ?? 'none'}
                                            onValueChange={(v) =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => ({
                                                  ...current,
                                                  button: {
                                                    title: current.button?.title ?? '',
                                                    href: current.button?.href ?? '',
                                                    icon: current.button?.icon,
                                                    target:
                                                      v === 'none'
                                                        ? undefined
                                                        : (v as NonNullable<ContentButton['target']>),
                                                  },
                                                }),
                                              )
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder='Select target' />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value='none'>Same tab</SelectItem>
                                              <SelectItem value='_blank'>New tab</SelectItem>
                                              <SelectItem value='_self'>Self</SelectItem>
                                              <SelectItem value='_parent'>Parent</SelectItem>
                                              <SelectItem value='_top'>Top</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>

                                  {(section.buttons ?? []).length ? (
                                    (section.buttons ?? []).map((b, index) => (
                                      <div
                                        key={`${sectionKey}-buttons-${index}`}
                                        className='rounded-2xl border border-white/10 bg-white/[0.03] p-3'
                                      >
                                        <div className='grid gap-3 md:grid-cols-2'>
                                          <div className='space-y-2'>
                                            <div className='text-sm font-medium text-white'>
                                              Label
                                            </div>
                                            <Input
                                              value={b.title ?? ''}
                                              onChange={(e) =>
                                                updateSection(
                                                  activePageKey,
                                                  sectionKey,
                                                  (current) => {
                                                    const next = [...(current.buttons ?? [])];
                                                    const curr = next[index] ?? { title: '', href: '' };
                                                    next[index] = { ...curr, title: e.target.value };
                                                    return { ...current, buttons: next };
                                                  },
                                                )
                                              }
                                            />
                                          </div>
                                          <div className='space-y-2'>
                                            <div className='text-sm font-medium text-white'>
                                              URL
                                            </div>
                                            <Input
                                              value={b.href ?? ''}
                                              onChange={(e) =>
                                                updateSection(
                                                  activePageKey,
                                                  sectionKey,
                                                  (current) => {
                                                    const next = [...(current.buttons ?? [])];
                                                    const curr = next[index] ?? { title: '', href: '' };
                                                    next[index] = { ...curr, href: e.target.value };
                                                    return { ...current, buttons: next };
                                                  },
                                                )
                                              }
                                            />
                                          </div>
                                          <div className='space-y-2'>
                                            <div className='text-sm font-medium text-white'>
                                              Icon
                                            </div>
                                            <Input
                                              value={b.icon ?? ''}
                                              onChange={(e) =>
                                                updateSection(
                                                  activePageKey,
                                                  sectionKey,
                                                  (current) => {
                                                    const next = [...(current.buttons ?? [])];
                                                    const curr = next[index] ?? { title: '', href: '' };
                                                    next[index] = { ...curr, icon: e.target.value || undefined };
                                                    return { ...current, buttons: next };
                                                  },
                                                )
                                              }
                                            />
                                          </div>
                                          <div className='space-y-2'>
                                            <div className='text-sm font-medium text-white'>
                                              Target
                                            </div>
                                            <Select
                                              value={b.target ?? 'none'}
                                              onValueChange={(v) =>
                                                updateSection(
                                                  activePageKey,
                                                  sectionKey,
                                                  (current) => {
                                                    const next = [...(current.buttons ?? [])];
                                                    const curr = next[index] ?? { title: '', href: '' };
                                                    next[index] = {
                                                      ...curr,
                                                      target:
                                                        v === 'none' ? undefined : (v as typeof curr.target),
                                                    };
                                                    return { ...current, buttons: next };
                                                  },
                                                )
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder='Select target' />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value='none'>Same tab</SelectItem>
                                                <SelectItem value='_blank'>New tab</SelectItem>
                                                <SelectItem value='_self'>Self</SelectItem>
                                                <SelectItem value='_parent'>Parent</SelectItem>
                                                <SelectItem value='_top'>Top</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <div className='mt-3 flex justify-end'>
                                          <Button
                                            type='button'
                                            size='sm'
                                            variant='secondary'
                                            onClick={() =>
                                              updateSection(
                                                activePageKey,
                                                sectionKey,
                                                (current) => {
                                                  const next = [...(current.buttons ?? [])];
                                                  next.splice(index, 1);
                                                  return {
                                                    ...current,
                                                    buttons: next.length ? next : undefined,
                                                  };
                                                },
                                              )
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className='text-sm text-white/70'>
                                      No extra buttons yet.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'>
                                <div className='flex items-center justify-between gap-2'>
                                  <div className='text-sm font-medium text-white'>
                                    Items
                                  </div>
                                  <Button
                                    type='button'
                                    size='sm'
                                    onClick={() =>
                                      openAddItemModal(activePageKey, sectionKey)
                                    }
                                  >
                                    <Plus className='h-4 w-4' />
                                    Add item
                                  </Button>
                                </div>

                                <div className='mt-3 space-y-3'>
                                  {items.length ? (
                                    items.map((it, idx) => (
                                      <div
                                        key={`${sectionKey}-item-${idx}`}
                                        className='rounded-2xl border border-white/10 bg-white/[0.03] p-3'
                                      >
                                        <div className='flex items-start justify-between gap-3'>
                                          <div className='min-w-0 space-y-1'>
                                            <div className='truncate text-sm font-semibold text-white'>
                                              {it.title}
                                            </div>
                                            <div className='line-clamp-2 text-xs text-white/60'>
                                              {it.body}
                                            </div>
                                          </div>
                                          <div className='flex items-center gap-2'>
                                            <Button
                                              type='button'
                                              size='icon'
                                              variant='secondary'
                                              onClick={() =>
                                                openEditItemModal(
                                                  activePageKey,
                                                  sectionKey,
                                                  idx,
                                                )
                                              }
                                            >
                                              <Pencil className='h-4 w-4' />
                                            </Button>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  type='button'
                                                  size='icon'
                                                  variant='secondary'
                                                >
                                                  <Trash2 className='h-4 w-4' />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Delete item?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    This removes the item from the section.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      removeItem(
                                                        activePageKey,
                                                        sectionKey,
                                                        idx,
                                                      )
                                                    }
                                                  >
                                                    Delete
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </div>

                                        {it.image ? (
                                          <div className='mt-3'>
                                            <div className='relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]'>
                                              <Image
                                                src={it.image}
                                                alt={it.title}
                                                fill
                                                className='object-cover'
                                              />
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    ))
                                  ) : (
                                    <div className='text-sm text-white/70'>
                                      No items yet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70'>
                  {activePageKey
                    ? 'No sections found.'
                    : 'Select a page to edit.'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PageItemModal
        open={itemModalOpen}
        mode={typeof itemModalIndex === 'number' ? 'edit' : 'add'}
        item={itemDraft}
        onOpenChange={(next) => {
          setItemModalOpen(next);
          if (!next) {
            setItemModalIndex(null);
            setItemDraft(emptyItem());
          }
        }}
        onItemChange={(updater) => setItemDraft(updater)}
        onSave={saveItemModal}
      />
    </div>
  );
}
