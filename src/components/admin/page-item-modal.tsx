'use client';

import type { Item } from '@/models/content';
import type { Media } from '@/models/media';
import { MediaManager } from '@/components/admin/media-manager';
import { Button as UiButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function toMedia(url: string | undefined, type: Media['type']): Media | null {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return null;
  return { url: trimmed, type, alt: '' };
}

export function PageItemModal({
  open,
  mode,
  item,
  onOpenChange,
  onItemChange,
  onSave,
}: {
  open: boolean;
  mode: 'add' | 'edit';
  item: Item;
  onOpenChange: (next: boolean) => void;
  onItemChange: (updater: (prev: Item) => Item) => void;
  onSave: () => void;
}) {
  const primaryButton = item.button;
  const extraButtons = item.buttons ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark bg-background text-foreground sm:max-w-[720px]'>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit item' : 'Add item'}</DialogTitle>
          <DialogDescription>
            This item will be saved inside the section&apos;s items array.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] pr-4'>
          <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2 md:col-span-2'>
            <div className='text-sm font-medium'>Title</div>
            <Input
              value={item.title}
              onChange={(e) =>
                onItemChange((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <div className='text-sm font-medium'>Subtitle</div>
            <Input
              value={item.subtitle ?? ''}
              onChange={(e) =>
                onItemChange((p) => ({ ...p, subtitle: e.target.value }))
              }
            />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <div className='text-sm font-medium'>Body</div>
            <Textarea
              value={item.body}
              onChange={(e) =>
                onItemChange((p) => ({ ...p, body: e.target.value }))
              }
              className='min-h-[140px]'
            />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <div className='text-sm font-medium'>Link (href)</div>
            <Input
              value={item.href ?? ''}
              onChange={(e) =>
                onItemChange((p) => ({ ...p, href: e.target.value }))
              }
            />
          </div>

          <div className='space-y-3 md:col-span-2'>
            <div className='text-sm font-medium'>Image</div>
            <MediaManager
              value={toMedia(item.image, 'image')}
              onChange={(m) => onItemChange((p) => ({ ...p, image: m?.url || '' }))}
              defaultType='image'
              triggerLabel={item.image ? 'Change image' : 'Select image'}
            />
          </div>

          <div className='space-y-3 md:col-span-2'>
            <div className='text-sm font-medium'>Thumbnail</div>
            <MediaManager
              value={toMedia(item.thumbnail, 'image')}
              onChange={(m) =>
                onItemChange((p) => ({ ...p, thumbnail: m?.url || '' }))
              }
              defaultType='image'
              triggerLabel={item.thumbnail ? 'Change thumbnail' : 'Select thumbnail'}
            />
          </div>

          <div className='space-y-3 md:col-span-2'>
            <div className='text-sm font-medium'>Video</div>
            <MediaManager
              value={toMedia(item.video, 'video')}
              onChange={(m) => onItemChange((p) => ({ ...p, video: m?.url || '' }))}
              defaultType='video'
              triggerLabel={item.video ? 'Change video' : 'Select video'}
            />
          </div>

          <div className='md:col-span-2 rounded-2xl border border-border/60 bg-muted/10 p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div className='text-sm font-medium'>Button</div>
              {primaryButton ? (
                <UiButton
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={() => onItemChange((p) => ({ ...p, button: undefined }))}
                >
                  Clear
                </UiButton>
              ) : (
                <UiButton
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={() =>
                    onItemChange((p) => ({
                      ...p,
                      button: { title: '', href: '' },
                    }))
                  }
                >
                  Add button
                </UiButton>
              )}
            </div>

            {primaryButton ? (
              <div className='mt-3 grid gap-3 md:grid-cols-2'>
                <div className='space-y-2'>
                  <div className='text-sm font-medium'>Label</div>
                  <Input
                    value={primaryButton.title ?? ''}
                    onChange={(e) =>
                      onItemChange((p) => ({
                        ...p,
                        button: {
                          title: e.target.value,
                          href: p.button?.href ?? '',
                          icon: p.button?.icon,
                          target: p.button?.target,
                        },
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='text-sm font-medium'>URL</div>
                  <Input
                    value={primaryButton.href ?? ''}
                    onChange={(e) =>
                      onItemChange((p) => ({
                        ...p,
                        button: {
                          title: p.button?.title ?? '',
                          href: e.target.value,
                          icon: p.button?.icon,
                          target: p.button?.target,
                        },
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='text-sm font-medium'>Icon</div>
                  <Input
                    value={primaryButton.icon ?? ''}
                    onChange={(e) =>
                      onItemChange((p) => ({
                        ...p,
                        button: {
                          title: p.button?.title ?? '',
                          href: p.button?.href ?? '',
                          icon: e.target.value || undefined,
                          target: p.button?.target,
                        },
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='text-sm font-medium'>Target</div>
                  <Select
                    value={primaryButton.target ?? 'none'}
                    onValueChange={(v) =>
                      onItemChange((p) => ({
                        ...p,
                        button: {
                          title: p.button?.title ?? '',
                          href: p.button?.href ?? '',
                          icon: p.button?.icon,
                          target: v === 'none' ? undefined : (v as Item['button'] extends { target?: infer T } ? T : never),
                        },
                      }))
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

          <div className='md:col-span-2 rounded-2xl border border-border/60 bg-muted/10 p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div className='text-sm font-medium'>Buttons</div>
              <UiButton
                type='button'
                variant='secondary'
                size='sm'
                onClick={() =>
                  onItemChange((p) => ({
                    ...p,
                    buttons: [...(p.buttons ?? []), { title: '', href: '' }],
                  }))
                }
              >
                Add button
              </UiButton>
            </div>

            {extraButtons.length ? (
              <div className='mt-3 space-y-3'>
                {extraButtons.map((b, index) => (
                  <div
                    key={`${b.title}-${b.href}-${index}`}
                    className='rounded-2xl border border-border/60 bg-background/40 p-3'
                  >
                    <div className='grid gap-3 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <div className='text-sm font-medium'>Label</div>
                        <Input
                          value={b.title ?? ''}
                          onChange={(e) =>
                            onItemChange((p) => {
                              const next = [...(p.buttons ?? [])];
                              const current = next[index] ?? { title: '', href: '' };
                              next[index] = {
                                ...current,
                                title: e.target.value,
                              };
                              return { ...p, buttons: next };
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='text-sm font-medium'>URL</div>
                        <Input
                          value={b.href ?? ''}
                          onChange={(e) =>
                            onItemChange((p) => {
                              const next = [...(p.buttons ?? [])];
                              const current = next[index] ?? { title: '', href: '' };
                              next[index] = {
                                ...current,
                                href: e.target.value,
                              };
                              return { ...p, buttons: next };
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='text-sm font-medium'>Icon</div>
                        <Input
                          value={b.icon ?? ''}
                          onChange={(e) =>
                            onItemChange((p) => {
                              const next = [...(p.buttons ?? [])];
                              const current = next[index] ?? { title: '', href: '' };
                              next[index] = {
                                ...current,
                                icon: e.target.value || undefined,
                              };
                              return { ...p, buttons: next };
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='text-sm font-medium'>Target</div>
                        <Select
                          value={b.target ?? 'none'}
                          onValueChange={(v) =>
                            onItemChange((p) => {
                              const next = [...(p.buttons ?? [])];
                              const current = next[index] ?? { title: '', href: '' };
                              next[index] = {
                                ...current,
                                target:
                                  v === 'none'
                                    ? undefined
                                    : (v as typeof current.target),
                              };
                              return { ...p, buttons: next };
                            })
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
                      <UiButton
                        type='button'
                        variant='secondary'
                        size='sm'
                        onClick={() =>
                          onItemChange((p) => {
                            const next = [...(p.buttons ?? [])];
                            next.splice(index, 1);
                            return { ...p, buttons: next.length ? next : undefined };
                          })
                        }
                      >
                        Remove
                      </UiButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='mt-3 text-sm text-muted-foreground'>
                No buttons yet.
              </div>
            )}
          </div>
        </div>
        </ScrollArea>

        <DialogFooter>
          <UiButton type='button' variant='secondary' onClick={() => onOpenChange(false)}>
            Cancel
          </UiButton>
          <UiButton type='button' onClick={onSave}>
            Save item
          </UiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
