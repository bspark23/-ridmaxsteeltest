'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { Image as ImageIcon, Search, Trash2, Upload } from 'lucide-react';

import type { Media, MediaType } from '@/models/media';
import { MediaService } from '@/services/media.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type MediaManagerValue =
  | (Media & {
      id?: string;
      filename?: string;
      contentType?: string;
      sizeBytes?: number;
    })
  | null;

function inferTypeFromContentType(contentType: string): MediaType {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';
  return 'document';
}

function folderForType(type: MediaType): 'images' | 'videos' | 'documents' {
  if (type === 'image') return 'images';
  if (type === 'document') return 'documents';
  return 'videos';
}

export function MediaManager({
  value,
  onChange,
  defaultType = 'image',
  allowDelete = false,
  triggerLabel = 'Select media',
}: {
  value: MediaManagerValue;
  onChange: (next: MediaManagerValue) => void;
  defaultType?: MediaType;
  allowDelete?: boolean;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>(defaultType);
  const [page, setPage] = useState(1);

  const [uploadType, setUploadType] = useState<MediaType>(defaultType);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingDataUrl, setPendingDataUrl] = useState<string>('');

  const folderFilter = useMemo(() => {
    if (typeFilter === 'all') return undefined;
    return folderForType(typeFilter);
  }, [typeFilter]);

  const listKey = useMemo(
    () => [
      '/media',
      {
        folder: folderFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        q: query.trim() || undefined,
        page,
        limit: 60,
      },
    ] as const,
    [folderFilter, page, query, typeFilter],
  );

  const { data, isLoading, mutate } = useSWR(listKey, ([, params]) =>
    MediaService.list(params),
  );

  const items = data?.media ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages;
  const hasPrev = page > 1;
  const hasNext =
    typeof totalPages === 'number' ? page < totalPages : Boolean(pagination?.hasMore);

  const accept = useMemo(() => {
    if (uploadType === 'image') return 'image/*';
    if (uploadType === 'video') return 'video/*';
    if (uploadType === 'audio') return 'audio/*';
    return '*/*';
  }, [uploadType]);

  async function handlePickFile(file: File | null) {
    setPendingFile(file);
    setPendingDataUrl('');
    if (!file) return;
    const inferred = inferTypeFromContentType(file.type || '');
    setUploadType(inferred);
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(file);
    });
    setPendingDataUrl(dataUrl);
  }

  async function upload() {
    if (!pendingFile || !pendingDataUrl) return;
    setUploading(true);
    try {
      const contentType = pendingFile.type || 'application/octet-stream';
      const created = await MediaService.create({
        folder: folderForType(uploadType),
        filename: pendingFile.name,
        contentType,
        dataBase64: pendingDataUrl,
        type: uploadType,
        alt: uploadAlt.trim() || undefined,
        caption: uploadCaption.trim() || undefined,
      });

      toast.success('Media uploaded');
      onChange({
        id: created.id,
        url: created.url,
        type: created.type,
        alt: created.alt,
        caption: created.caption,
        width: created.width,
        height: created.height,
        filename: created.filename,
        contentType: created.contentType,
        sizeBytes: created.sizeBytes,
      });
      setOpen(false);
      setTab('library');
      setPendingFile(null);
      setPendingDataUrl('');
      setUploadAlt('');
      setUploadCaption('');
      await mutate();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia(id: string) {
    if (!allowDelete) return;
    try {
      await MediaService.delete(id);
      toast.success('Media deleted');
      if (value?.id === id) onChange(null);
      await mutate();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete media');
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-muted/10 p-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {value.type.toUpperCase()}
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="truncate text-muted-foreground">{value.url}</span>
            </div>
            {value.type === 'image' ? (
              <div className="mt-2 overflow-hidden rounded-xl border bg-background">
                <img src={value.url} alt={value.alt || ''} className="h-32 w-full object-cover" />
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onChange(null)}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setTab('library');
            setQuery('');
            setTypeFilter(defaultType);
            setPage(1);
            setPendingFile(null);
            setPendingDataUrl('');
            setUploadAlt('');
            setUploadCaption('');
            setUploadType(defaultType);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="rounded-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="dark bg-background text-foreground overflow-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Media</DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-4 dark bg-background text-foreground">
              <div className="grid gap-3 md:grid-cols-12">
                <div className="space-y-2 md:col-span-7">
                  <div className="text-sm font-semibold">Search</div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search by filename or URL"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-5">
                  <div className="text-sm font-semibold">Type</div>
                  <Select
                    value={typeFilter}
                    onValueChange={(v) => {
                      setTypeFilter(v as MediaType | 'all');
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark bg-background text-foreground">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border">
                <ScrollArea className="h-[420px]">
                  <div className="p-3">
                    {isLoading ? (
                      <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                        Loading media…
                      </div>
                    ) : items.length ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((m) => (
                          <div key={m.id} className="overflow-hidden rounded-2xl border bg-background">
                            {m.type === 'image' ? (
                              <div className="h-40 w-full bg-muted/10">
                                <img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <div className="flex h-40 items-center justify-center bg-muted/10">
                                <Badge variant="outline">{m.type}</Badge>
                              </div>
                            )}
                            <div className="space-y-2 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-semibold">{m.filename || m.id}</div>
                                  <div className="truncate text-xs text-muted-foreground">{m.url}</div>
                                </div>
                                <Badge variant="outline">{m.type}</Badge>
                              </div>
                              <div className="flex flex-wrap justify-end gap-2">
                                {allowDelete ? (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button type="button" variant="outline" className="rounded-full">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="dark bg-background text-foreground">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete media?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete this media item. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          variant="destructive"
                                          onClick={() => {
                                            void deleteMedia(m.id);
                                          }}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                ) : null}
                                <Button
                                  type="button"
                                  className="rounded-full"
                                  onClick={() => {
                                    onChange({
                                      id: m.id,
                                      url: m.url,
                                      type: m.type,
                                      alt: m.alt,
                                      caption: m.caption,
                                      width: m.width,
                                      height: m.height,
                                      filename: m.filename,
                                      contentType: m.contentType,
                                      sizeBytes: m.sizeBytes,
                                    });
                                    setOpen(false);
                                  }}
                                >
                                  Select
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                        No media found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  Page {page}
                  {typeof totalPages === 'number' ? ` of ${totalPages}` : ''}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="dark bg-background text-foreground space-y-4">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-4">
                  <div className="text-sm font-semibold">Type</div>
                  <Select value={uploadType} onValueChange={(v) => setUploadType(v as MediaType)}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark bg-background text-foreground">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-8">
                  <div className="text-sm font-semibold">File</div>
                  <Input
                    type="file"
                    accept={accept}
                    onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
                    className="rounded-2xl"
                  />
                </div>
              </div>

              {pendingDataUrl && uploadType === 'image' ? (
                <div className="overflow-hidden rounded-2xl border bg-background">
                  <img src={pendingDataUrl} alt="" className="h-56 w-full object-cover" />
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-6">
                  <div className="text-sm font-semibold">Alt (optional)</div>
                  <Input
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Description for accessibility"
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-6">
                  <div className="text-sm font-semibold">Caption (optional)</div>
                  <Textarea
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Caption"
                    className="min-h-24"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            {tab === 'upload' ? (
              <Button
                type="button"
                className="rounded-full"
                onClick={upload}
                disabled={!pendingFile || uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
