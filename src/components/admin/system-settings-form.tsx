'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { SystemSettings } from '@/models/settings';
import type { Media } from '@/models/media';
import { MediaManager } from '@/components/admin/media-manager';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

function parseCsv(value: string | undefined) {
  const raw = (value ?? '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toImageMedia(url: string | undefined): Media | null {
  const u = (url ?? '').trim();
  if (!u) return null;
  return { url: u, type: 'image', alt: '' };
}

const schema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  siteSlogan: z.string().optional().or(z.literal('')),
  siteUrl: z.string().min(1, 'Site URL is required'),
  themeColor: z.string().optional().or(z.literal('')),
  siteLogo: z.string().optional().or(z.literal('')),
  siteIcon: z.string().optional().or(z.literal('')),
  siteGraphImage: z.string().optional().or(z.literal('')),
  siteKeywordsCsv: z.string().optional().or(z.literal('')),
  siteAuthor: z.string().optional().or(z.literal('')),
  siteLocale: z.string().optional().or(z.literal('')),
  siteType: z.string().optional().or(z.literal('')),
  ogTitle: z.string().optional().or(z.literal('')),
  ogDescription: z.string().optional().or(z.literal('')),
  ogImage: z.string().optional().or(z.literal('')),
  ogImageAlt: z.string().optional().or(z.literal('')),
  twitterCard: z.string().optional().or(z.literal('')),
  twitterSite: z.string().optional().or(z.literal('')),
  twitterCreator: z.string().optional().or(z.literal('')),
  twitterTitle: z.string().optional().or(z.literal('')),
  twitterDescription: z.string().optional().or(z.literal('')),
  twitterImage: z.string().optional().or(z.literal('')),
  contactEmail: z.string().optional().or(z.literal('')),
  contactPhonesCsv: z.string().optional().or(z.literal('')),
  contactWhatsappPhone: z.string().optional().or(z.literal('')),
  contactMap: z.string().optional().or(z.literal('')),
  contactAddresses: z
    .array(
      z.object({
        country: z.string().min(1, 'Country is required'),
        phone: z.string().min(1, 'Phone is required'),
        address: z.string().min(1, 'Address is required'),
      }),
    )
    .optional(),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1, 'Label is required'),
        href: z.string().min(1, 'URL is required'),
      }),
    )
    .optional(),
});

export type SystemSettingsFormValues = z.infer<typeof schema>;

export function SystemSettingsForm({
  initial,
  onSave,
}: {
  initial: SystemSettings;
  onSave: (next: SystemSettings) => Promise<void>;
}) {
  const defaults = useMemo<SystemSettingsFormValues>(() => {
    const contact = initial.contact ?? {
      email: '',
      phones: [],
      whatsappPhone: '',
      addresses: [],
      map: '',
    };

    return {
      siteName: initial.siteName ?? '',
      siteDescription: initial.siteDescription ?? '',
      siteSlogan: initial.siteSlogan ?? '',
      siteUrl: initial.siteUrl ?? '',
      themeColor: '',
      siteLogo: initial.siteLogo ?? '',
      siteIcon: initial.siteIcon ?? '',
      siteGraphImage: initial.siteGraphImage ?? '',
      siteKeywordsCsv: (initial.siteKeywords ?? []).join(', '),
      siteAuthor: initial.siteAuthor ?? '',
      siteLocale: initial.siteLocale ?? '',
      siteType: initial.siteType ?? '',
      ogTitle: initial.ogTitle ?? '',
      ogDescription: initial.ogDescription ?? '',
      ogImage: initial.ogImage ?? '',
      ogImageAlt: initial.ogImageAlt ?? '',
      twitterCard: initial.twitterCard ?? '',
      twitterSite: initial.twitterSite ?? '',
      twitterCreator: initial.twitterCreator ?? '',
      twitterTitle: initial.twitterTitle ?? '',
      twitterDescription: initial.twitterDescription ?? '',
      twitterImage: initial.twitterImage ?? '',
      contactEmail: contact.email ?? '',
      contactPhonesCsv: (contact.phones ?? []).join(', '),
      contactWhatsappPhone: contact.whatsappPhone ?? '',
      contactMap: contact.map ?? '',
      contactAddresses: contact.addresses ?? [],
      socialLinks: (initial.socialLinks ?? []).map((l) => ({
        label: l.label ?? '',
        href: l.href ?? '',
      })),
    };
  }, [initial]);

  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: 'contactAddresses',
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults, form]);

  const [saving, setSaving] = useState(false);

  const [logoMedia, setLogoMedia] = useState<Media | null>(() =>
    toImageMedia(initial.siteLogo),
  );
  const [iconMedia, setIconMedia] = useState<Media | null>(() =>
    toImageMedia(initial.siteIcon),
  );
  const [graphMedia, setGraphMedia] = useState<Media | null>(() =>
    toImageMedia(initial.siteGraphImage),
  );

  async function submit(values: SystemSettingsFormValues) {
    setSaving(true);
    try {
      const nextContact: SystemSettings['contact'] = {
        email: values.contactEmail?.trim() || '',
        phones: parseCsv(values.contactPhonesCsv),
        whatsappPhone: values.contactWhatsappPhone?.trim() || '',
        map: values.contactMap?.trim() || '',
        addresses: (values.contactAddresses ?? []).map((a) => ({
          country: a.country.trim(),
          phone: a.phone.trim(),
          address: a.address.trim(),
        })),
      };

      const nextSocialLinks: SystemSettings['socialLinks'] = (
        values.socialLinks ?? []
      )
        .map((l) => ({
          label: l.label.trim(),
          href: l.href.trim(),
        }))
        .filter((l) => l.label && l.href);

      const next: SystemSettings = {
        ...initial,
        siteName: values.siteName.trim(),
        siteDescription: values.siteDescription.trim(),
        siteSlogan: values.siteSlogan?.trim() || '',
        siteUrl: values.siteUrl.trim(),
        siteLogo: values.siteLogo?.trim() || '',
        siteIcon: values.siteIcon?.trim() || '',
        siteGraphImage: values.siteGraphImage?.trim() || '',
        siteKeywords: parseCsv(values.siteKeywordsCsv),
        siteAuthor: values.siteAuthor?.trim() || '',
        siteLocale: values.siteLocale?.trim() || '',
        siteType: values.siteType?.trim() || '',
        ogTitle: values.ogTitle?.trim() || '',
        ogDescription: values.ogDescription?.trim() || '',
        ogImage: values.ogImage?.trim() || '',
        ogImageAlt: values.ogImageAlt?.trim() || '',
        twitterCard: values.twitterCard?.trim() || '',
        twitterSite: values.twitterSite?.trim() || '',
        twitterCreator: values.twitterCreator?.trim() || '',
        twitterTitle: values.twitterTitle?.trim() || '',
        twitterDescription: values.twitterDescription?.trim() || '',
        twitterImage: values.twitterImage?.trim() || '',
        maintenanceMode: !!initial.maintenanceMode,
        headerLinks: initial.headerLinks,
        footerLinks: initial.footerLinks,
        socialLinks: nextSocialLinks,
        contact: nextContact,
      };

      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className='grid gap-6 lg:grid-cols-12'
      >
        <Card className='border-white/10 bg-white/5 lg:col-span-8'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Brand</CardTitle>
            <CardDescription className='text-white/70'>
              Basic brand and identity settings.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='siteName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='siteUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='https://example.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='siteSlogan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Optional' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='siteKeywordsCsv'
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
            <FormField
              control={form.control}
              name='siteDescription'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='md:col-span-2 grid gap-4 lg:grid-cols-3'>
              <div className='space-y-2'>
                <div className='text-sm font-medium'>Logo</div>
                <MediaManager
                  value={logoMedia}
                  onChange={(m) => {
                    const media = (m as Media | null) ?? null;
                    setLogoMedia(media);
                    form.setValue('siteLogo', media?.url ?? '');
                  }}
                  defaultType='image'
                  triggerLabel='Select logo'
                />
                <FormField
                  control={form.control}
                  name='siteLogo'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='Logo URL' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium'>Icon</div>
                <MediaManager
                  value={iconMedia}
                  onChange={(m) => {
                    const media = (m as Media | null) ?? null;
                    setIconMedia(media);
                    form.setValue('siteIcon', media?.url ?? '');
                  }}
                  defaultType='image'
                  triggerLabel='Select icon'
                />
                <FormField
                  control={form.control}
                  name='siteIcon'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='Icon URL' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium'>OG image</div>
                <MediaManager
                  value={graphMedia}
                  onChange={(m) => {
                    const media = (m as Media | null) ?? null;
                    setGraphMedia(media);
                    form.setValue('siteGraphImage', media?.url ?? '');
                    form.setValue('ogImage', media?.url ?? '');
                    form.setValue('twitterImage', media?.url ?? '');
                  }}
                  defaultType='image'
                  triggerLabel='Select OG image'
                />
                <FormField
                  control={form.control}
                  name='siteGraphImage'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='OG image URL' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='md:col-span-2'>
              <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>Maintenance mode</div>
                  <div className='text-xs text-white/60'>
                    Managed by the system.
                  </div>
                </div>
                <Switch checked={!!initial.maintenanceMode} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-white/5 lg:col-span-4'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>SEO</CardTitle>
            <CardDescription className='text-white/70'>
              Open Graph and Twitter settings.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='ogTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='twitterCard'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter card</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='summary_large_image' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ogDescription'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>OG description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ogImage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='twitterImage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-white/5 lg:col-span-8'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Contact</CardTitle>
            <CardDescription className='text-white/70'>
              Public contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='contactEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='hello@example.com' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactWhatsappPhone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='+234…' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactPhonesCsv'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Phones</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='+234…, +234…' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactMap'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Map URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='https://maps.google.com/…'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between gap-2'>
                <div className='text-sm font-medium text-white'>Addresses</div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    appendAddress({ country: '', phone: '', address: '' })
                  }
                >
                  Add address
                </Button>
              </div>
              <div className='space-y-3'>
                {addressFields.length ? (
                  addressFields.map((f, index) => (
                    <div
                      key={f.id}
                      className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'
                    >
                      <div className='grid gap-3 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name={`contactAddresses.${index}.country`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contactAddresses.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contactAddresses.${index}.address`}
                          render={({ field }) => (
                            <FormItem className='md:col-span-2'>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='mt-3 flex justify-end'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeAddress(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70'>
                    No addresses yet.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-white/5 lg:col-span-4'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Social links</CardTitle>
            <CardDescription className='text-white/70'>
              Links displayed in the footer.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between gap-2'>
              <div className='text-sm font-medium text-white'>Links</div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => appendSocial({ label: '', href: '' })}
              >
                Add link
              </Button>
            </div>
            <div className='space-y-3'>
              {socialFields.length ? (
                socialFields.map((f, index) => (
                  <div
                    key={f.id}
                    className='rounded-2xl border border-white/10 bg-white/[0.02] p-4'
                  >
                    <div className='grid gap-3 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder='Instagram' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.href`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder='https://…' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mt-3 flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeSocial(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70'>
                  No social links yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-white/5 lg:col-span-8'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Navigation</CardTitle>
            <CardDescription className='text-white/70'>
              Header and footer links are managed elsewhere.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-white'>Header links</div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70'>
                {(initial.headerLinks ?? []).length ? (
                  <div className='space-y-1'>
                    {initial.headerLinks.map((l) => (
                      <div
                        key={`${l.label}-${l.href}`}
                        className='flex items-center justify-between gap-3'
                      >
                        <span className='truncate'>{l.label}</span>
                        <span className='truncate text-white/50'>{l.href}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No header links configured.</div>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-white'>Footer links</div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70'>
                {(initial.footerLinks ?? []).length ? (
                  <div className='space-y-2'>
                    {initial.footerLinks.map((section) => (
                      <div key={section.section} className='space-y-1'>
                        <div className='text-xs font-semibold text-white/80'>
                          {section.section}
                        </div>
                        {(section.links ?? []).map((l) => (
                          <div
                            key={`${section.section}-${l.label}-${l.href}`}
                            className='flex items-center justify-between gap-3'
                          >
                            <span className='truncate'>{l.label}</span>
                            <span className='truncate text-white/50'>
                              {l.href}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No footer links configured.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end gap-2 lg:col-span-12'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset(defaults)}
          >
            Reset
          </Button>
          <Button type='submit' loading={saving}>
            Save settings
          </Button>
        </div>
      </form>
    </Form>
  );
}
