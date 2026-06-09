'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

import type { Media } from '@/models/media';
import type { Post, PostCreateInput, PostUpdateInput } from '@/models/post';
import { slugify } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { MediaManager } from '@/components/admin/media-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PostStatus = Post['status'];
type PostVisibility = Post['visibility'];

const statusValues: PostStatus[] = ['draft', 'published', 'archived', 'scheduled'];
const visibilityValues: PostVisibility[] = [
  'public',
  'private',
  'password-protected',
];

function htmlToText(html: string) {
  const input = (html ?? '').trim();
  if (!input) return '';
  const withoutScripts = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ');
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, ' ');
  return withoutTags.replace(/\s+/g, ' ').trim();
}

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional().or(z.literal('')),
    excerpt: z.string().min(1, 'Excerpt is required'),
    content: z
      .string()
      .refine((v) => htmlToText(v).length > 0, 'Content is required'),
    categoryName: z.string().min(1, 'Category is required'),
    tagsCsv: z.string().optional().or(z.literal('')),
    status: z.enum(statusValues as unknown as [PostStatus, ...PostStatus[]]),
    visibility: z.enum(
      visibilityValues as unknown as [PostVisibility, ...PostVisibility[]],
    ),
    password: z.string().optional().or(z.literal('')),
    metaTitle: z.string().optional().or(z.literal('')),
    metaDescription: z.string().optional().or(z.literal('')),
    metaKeywordsCsv: z.string().optional().or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    if (values.visibility === 'password-protected' && !values.password?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required for password-protected posts',
        path: ['password'],
      });
    }
  });

export type PostFormValues = z.infer<typeof schema>;

function parseCsv(value: string | undefined) {
  const raw = (value ?? '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toMedia(value: unknown): Media | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Partial<Media> & { url?: unknown; type?: unknown };
  if (typeof v.url !== 'string' || typeof v.type !== 'string') return undefined;
  const type = v.type as Media['type'];
  if (!['image', 'video', 'audio', 'document'].includes(type)) return undefined;
  return {
    url: v.url,
    type,
    alt: typeof v.alt === 'string' ? v.alt : undefined,
    caption: typeof v.caption === 'string' ? v.caption : undefined,
    width: typeof v.width === 'number' ? v.width : undefined,
    height: typeof v.height === 'number' ? v.height : undefined,
  };
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
    ],
    content: value?.trim() ? value : '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value?.trim() ? value : '<p></p>';
    if (current === next) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-2'>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          Strike
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          P
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => {
            const url = window.prompt('Link URL');
            if (!url?.trim()) return;
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
          }}
        >
          Link
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          Unlink
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={!editor}
          onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          Clear
        </Button>
      </div>

      <div
        className={[
          'min-h-[260px] w-full rounded-xl border border-input bg-input/30 px-3 py-3 text-base outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 md:text-sm',
          '[&_.ProseMirror]:min-h-[230px] [&_.ProseMirror]:outline-none',
          '[&_.ProseMirror_p]:my-2 [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold',
          '[&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6',
          '[&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6',
          '[&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground',
          className ?? '',
        ].join(' ')}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

type PostFormProps =
  | {
      mode: 'create';
      initialPost?: null;
      onSubmit: (payload: PostCreateInput) => Promise<Post>;
    }
  | {
      mode: 'edit';
      initialPost: Post;
      onSubmit: (payload: PostUpdateInput) => Promise<Post>;
    };

export function PostForm({ initialPost, mode, onSubmit }: PostFormProps) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [featured, setFeatured] = useState<Media | null>(
    initialPost?.featuredMedia ?? null,
  );

  const defaults = useMemo<PostFormValues>(() => {
    return {
      title: initialPost?.title ?? '',
      subtitle: initialPost?.subtitle ?? '',
      excerpt: initialPost?.excerpt ?? '',
      content: initialPost?.content ?? '',
      categoryName: initialPost?.category?.name ?? 'General',
      tagsCsv: (initialPost?.tags ?? [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(', '),
      status: initialPost?.status ?? 'draft',
      visibility: initialPost?.visibility ?? 'public',
      password: initialPost?.password ?? '',
      metaTitle: initialPost?.meta?.title ?? '',
      metaDescription: initialPost?.meta?.description ?? '',
      metaKeywordsCsv: (initialPost?.meta?.keywords ?? []).join(', '),
    };
  }, [initialPost]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
    setFeatured(initialPost?.featuredMedia ?? null);
  }, [defaults, form, initialPost?.featuredMedia]);

  const watchedTitle = form.watch('title');
  const slug = useMemo(() => slugify(watchedTitle), [watchedTitle]);

  const submitLabel = mode === 'create' ? 'Create post' : 'Save changes';
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values: PostFormValues) {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const author = user
        ? { id: user.uid, name: user.name, avatar: user.avatarUrl }
        : { id: 'system', name: 'System' };

      const categoryName = values.categoryName.trim();
      const categorySlug = slugify(categoryName);
      const tags = parseCsv(values.tagsCsv).map((name) => ({
        id: slugify(name),
        name,
        slug: slugify(name),
      }));

      const metaTitle = values.metaTitle?.trim() || values.title.trim();
      const metaDescription =
        values.metaDescription?.trim() || values.excerpt.trim();
      const metaKeywords = parseCsv(values.metaKeywordsCsv);

      const featuredMedia =
        featured ??
        ({
          url: '/images/placeholder.jpg',
          alt: values.title.trim(),
          type: 'image',
          width: 1600,
          height: 900,
        } satisfies Media);

      const contentText = htmlToText(values.content);
      const createPayload: PostCreateInput = {
        title: values.title.trim(),
        slug,
        subtitle: values.subtitle?.trim() || undefined,
        content: values.content,
        excerpt: values.excerpt.trim(),
        author,
        category: {
          id: categorySlug,
          name: categoryName,
          slug: categorySlug,
        },
        tags,
        featuredMedia,
        meta: {
          title: metaTitle,
          description: metaDescription,
          keywords: metaKeywords,
          ogImage: featuredMedia.url,
          canonicalUrl: undefined,
        },
        stats: initialPost?.stats ?? {
          views: 0,
          likes: 0,
          shares: 0,
          readingTime: Math.max(
            1,
            Math.ceil((contentText ? contentText.split(/\s+/).length : 0) / 200),
          ),
          commentCount: 0,
        },
        status: values.status,
        visibility: values.visibility,
        password:
          values.visibility === 'password-protected'
            ? values.password?.trim() || undefined
            : undefined,
        publishedAt:
          values.status === 'published'
            ? initialPost?.publishedAt ?? now
            : initialPost?.publishedAt,
        scheduledAt:
          values.status === 'scheduled'
            ? initialPost?.scheduledAt ?? now
            : initialPost?.scheduledAt,
        isPromoted: initialPost?.isPromoted ?? false,
        isFeatured: initialPost?.isFeatured ?? false,
        isPremium: initialPost?.isPremium ?? false,
        allowComments: initialPost?.allowComments ?? true,
        relatedPosts: initialPost?.relatedPosts ?? [],
        version: initialPost?.version ?? 1,
        lastModifiedBy: user?.uid ?? initialPost?.lastModifiedBy ?? 'system',
      };

      const createdOrUpdated =
        mode === 'create'
          ? await onSubmit(createPayload)
          : await onSubmit(createPayload);

      toast.success(mode === 'create' ? 'Post created' : 'Post updated');
      router.push(`/admin/blog/${encodeURIComponent(createdOrUpdated.id)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid gap-6 lg:grid-cols-[1fr_380px]'
      >
        <div className='space-y-6'>
          <Card className='border-white/10 bg-white/5'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-white'>Post</CardTitle>
              <CardDescription className='text-white/70'>
                Title, content and summary.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Post title' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70'>
                Slug: <span className='font-medium text-white'>{slug}</span>
              </div>

              <FormField
                control={form.control}
                name='subtitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Optional subtitle' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='excerpt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Short summary shown on cards and previews'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Write your post content…'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-white/5'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-white'>SEO</CardTitle>
              <CardDescription className='text-white/70'>
                Optional metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='metaTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Defaults to title' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='metaDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Defaults to excerpt' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='metaKeywordsCsv'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='comma,separated,keywords' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='border-white/10 bg-white/5'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-white'>Publishing</CardTitle>
              <CardDescription className='text-white/70'>
                Status, visibility, and taxonomy.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='draft'>Draft</SelectItem>
                        <SelectItem value='published'>Published</SelectItem>
                        <SelectItem value='scheduled'>Scheduled</SelectItem>
                        <SelectItem value='archived'>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select visibility' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>Public</SelectItem>
                        <SelectItem value='private'>Private</SelectItem>
                        <SelectItem value='password-protected'>
                          Password protected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('visibility') === 'password-protected' ? (
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type='password' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name='categoryName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g. News' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tagsCsv'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='design, marketing, tips' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-white/5'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-white'>Featured media</CardTitle>
              <CardDescription className='text-white/70'>
                Select or upload an image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaManager
                value={featured}
                onChange={(next) => setFeatured(toMedia(next) ?? null)}
                defaultType='image'
                triggerLabel='Choose featured image'
              />
            </CardContent>
          </Card>

          <div className='flex gap-2'>
            <Button type='submit' loading={saving} className='flex-1'>
              {submitLabel}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/admin/blog')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
